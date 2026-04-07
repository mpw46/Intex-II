import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np


def _safe_mode(series):
    """First mode value, or NaN if the series is empty or all-null (mode() is empty)."""
    m = series.mode(dropna=True)
    return m.iloc[0] if not m.empty else np.nan


def univariate(df):
  df_results = pd.DataFrame(columns=['Data Type', 'Count', 'Missing', 'Unique', 'Mode', 'Min', 'Q1',
                                     'Median', 'Q3', 'Max', 'Mean', 'Std', 'Skew', 'Kurt'])

  for col in df.columns:
    df_results.loc[col, "Data Type"] = df[col].dtype
    df_results.loc[col, "Count"] = df[col].count()
    df_results.loc[col, "Missing"] = df[col].isnull().sum()
    df_results.loc[col, "Unique"] = df[col].nunique()

    # Handle categorical features
    if df[col].dtype == 'object':
      col_mode = _safe_mode(df[col])
      if df[col].nunique() > 100 or df[col].nunique() == df[col].count():
        print(f"Column '{col}' has too many unique values ({df[col].nunique()}) for plotting. Skipping visualization.")
        df_results.loc[col, "Mode"] = col_mode
      else:
        df_results.loc[col, "Mode"] = col_mode

        plt.figure(figsize=(12, 6))
        value_counts = df[col].value_counts(normalize=False)
        total_rows = len(df)

        # Check for small groups across all categories, not just top 10
        has_small_group = any(count / total_rows < 0.05 for count in value_counts)

        # Get top 10 categories for plotting
        top_10_categories = value_counts.head(10)
        sns.countplot(x=col, data=df[df[col].isin(top_10_categories.index)], order=top_10_categories.index)

        plt.title(f'Top 10 Categories for {col}')
        plt.xlabel('Category')
        plt.ylabel('Count')
        plt.xticks(rotation=45, ha='right')

        # Add percentage labels
        for p in plt.gca().patches:
            height = p.get_height()
            if height > 0: # Avoid division by zero for empty bars
                percentage = 100 * height / total_rows
                plt.gca().text(p.get_x() + p.get_width() / 2, height + 10,  # Adjusted y-offset slightly
                                f'{percentage:.1f}%', ha='center', va='bottom')

        # Add warning message if any category is less than 5%
        if has_small_group:
            plt.text(1.02, 0.5, 'Warning: Some categories represent < 5% of total observations.',
                     transform=plt.gca().transAxes, fontsize=10, color='red', ha='left', va='center', wrap=True)

        plt.tight_layout()
        plt.show()

    # Handle numerical features (includes int/float and nullable Int64/Float64, etc.)
    elif pd.api.types.is_numeric_dtype(df[col]) and not pd.api.types.is_bool_dtype(df[col]):
      df_results.loc[col, "Mode"] = _safe_mode(df[col])
      df_results.loc[col, "Min"] = df[col].min()
      df_results.loc[col, "Q1"] = df[col].quantile(0.25)
      df_results.loc[col, "Median"] = df[col].median()
      df_results.loc[col, "Q3"] = df[col].quantile(0.75)
      df_results.loc[col, "Max"] = df[col].max()
      df_results.loc[col, "Mean"] = df[col].mean()
      df_results.loc[col, "Std"] = df[col].std()
      df_results.loc[col, "Skew"] = df[col].skew()
      df_results.loc[col, "Kurt"] = df[col].kurt()

      non_null_values = df[col].dropna()
      is_boolean_numeric = non_null_values.isin([0, 1]).all() and non_null_values.nunique() <= 2
      if not non_null_values.empty and not is_boolean_numeric:
        fig, (ax_box, ax_hist) = plt.subplots(
          nrows=2,
          ncols=1,
          sharex=True,
          figsize=(10, 6),
          gridspec_kw={'height_ratios': [1, 3]}
        )

        sns.boxplot(x=non_null_values, ax=ax_box, color='lightblue')
        ax_box.set_xlabel('')
        ax_box.set_title(f'Distribution of {col}')

        sns.histplot(non_null_values, kde=True, ax=ax_hist, color='steelblue')
        ax_hist.set_xlabel(col)
        ax_hist.set_ylabel('Count')

        plt.tight_layout()
        plt.show()

    elif pd.api.types.is_bool_dtype(df[col]):
      df_results.loc[col, "Mode"] = _safe_mode(df[col])
      df_results.loc[col, "Min"] = df[col].min()
      df_results.loc[col, "Max"] = df[col].max()
      df_results.loc[col, "Mean"] = df[col].mean()

  return df_results


def basic_wrangling(df):
    # drop columns where all values are different

    # we go through each column
    for col in df.columns:
        # if the column has only unique values and is not numeric, we drop the column
        if df[col].nunique() == df[col].count() and not pd.api.types.is_numeric_dtype(df[col]):
            df.drop(columns = [col], inplace=True)
    return df

def bin_categories(df):
    import pandas as pd
    #bin categories that makes us less than 5% of the data into a new category called "other"
    for col in df.columns:
      # if the column is not numeric
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            continue
        if not pd.api.types.is_numeric_dtype(df[col]):
          # the unique value counts are divided by total number of rows (percent of each category)
            value_counts = df[col].value_counts() / df.shape[0]
            # we find the categories that are less than 5% of the data
            less_than_5 = value_counts[value_counts < 0.05]
            # we replace the categories that are less than 5% of the data with 'Other'
            df.loc[df[col].isin(less_than_5.index), col] = 'Other'
    return df


def manage_dates(df):
    import pandas as pd
    import warnings

    new_cols = {}
    for col in df.columns:
        series = df[col]
        if pd.api.types.is_datetime64_any_dtype(series):
            dt_series = series
        else:
            try:
                dt_series = pd.to_datetime(series, errors="coerce", format="mixed")
            except TypeError:
                with warnings.catch_warnings():
                    warnings.filterwarnings(
                        "ignore",
                        message="Could not infer format.*",
                        category=UserWarning,
                    )
                    dt_series = pd.to_datetime(series, errors="coerce")

        if dt_series.notna().any():
            new_cols[f"{col}_day"] = dt_series.dt.day
            new_cols[f"{col}_dayofweek"] = dt_series.dt.dayofweek
            new_cols[f"{col}_month"] = dt_series.dt.month
            new_cols[f"{col}_year"] = dt_series.dt.year

            has_time = (
                (dt_series.dt.hour != 0)
                | (dt_series.dt.minute != 0)
                | (dt_series.dt.second != 0)
                | (dt_series.dt.microsecond != 0)
            ).any()
            if has_time:
                new_cols[f"{col}_hour"] = dt_series.dt.hour

    if new_cols:
        df = pd.concat([df, pd.DataFrame(new_cols, index=df.index)], axis=1)

    return df


def handle_missing_data(df, features=None, col_threshold=0.5, row_threshold=0.5):
    """
    Handle missing data by dropping sparse columns/rows and reporting missingness tests.

    Args:
        df: Pandas DataFrame.
        features: Optional list of columns to apply the logic to. If None, all columns are used.
        col_threshold: Drop columns with missing fraction > this value.
        row_threshold: Drop rows with missing fraction > this value (based on target features).

    Returns:
        df_clean: DataFrame after dropping columns/rows.
        report: Dict with missingness summary, tests, and recommendations.
    """
    import pandas as pd
    import numpy as np

    df_clean = df.copy()
    if features is None:
        target_cols = list(df_clean.columns)
        missing_features = []
    else:
        target_cols = [c for c in features if c in df_clean.columns]
        missing_features = [c for c in features if c not in df_clean.columns]

    dropped_columns = []
    dropped_rows = 0

    if target_cols:
        col_missing = df_clean[target_cols].isna().mean()
        dropped_columns = col_missing[col_missing > col_threshold].index.tolist()
        if dropped_columns:
            df_clean = df_clean.drop(columns=dropped_columns)
            target_cols = [c for c in target_cols if c not in dropped_columns]

    if target_cols:
        row_missing = df_clean[target_cols].isna().mean(axis=1)
        drop_idx = row_missing[row_missing > row_threshold].index
        if len(drop_idx) > 0:
            df_clean = df_clean.drop(index=drop_idx)
            dropped_rows = len(drop_idx)

    missing_summary = pd.DataFrame()
    if target_cols:
        missing_summary = pd.DataFrame({
            "missing_count": df_clean[target_cols].isna().sum(),
            "missing_pct": df_clean[target_cols].isna().mean(),
        })

    tests = {}
    recommendations = {
        "MCAR": "Listwise deletion is generally acceptable; simple imputation is usually safe.",
        "MAR": "Use imputation or models that condition on observed variables (e.g., MICE).",
        "MNAR": "Consider sensitivity analysis or model missingness explicitly; domain input needed.",
    }

    # --- MCAR test (Little's MCAR approximation for numeric columns) ---
    mcar_result = {"status": "not_run", "method": "little_mcar_approx", "p_value": None}
    numeric_cols = [c for c in target_cols if pd.api.types.is_numeric_dtype(df_clean[c])]
    if numeric_cols:
        try:
            import importlib
            import numpy.linalg as la

            stats = None
            if importlib.util.find_spec("scipy.stats") is not None:
                stats = importlib.import_module("scipy.stats")

            x = df_clean[numeric_cols]
            complete = x.dropna()
            if complete.shape[0] >= 2 and complete.shape[1] >= 1:
                mu = complete.mean()
                cov = complete.cov()
                stat = 0.0
                df_stat = 0
                mask = x.isna()
                patterns = mask.drop_duplicates()
                for _, pattern in patterns.iterrows():
                    idx = mask.eq(pattern).all(axis=1)
                    group = x.loc[idx]
                    if group.empty:
                        continue
                    obs_cols = pattern.index[~pattern.values]
                    if len(obs_cols) == 0:
                        continue
                    mean_g = group[obs_cols].mean()
                    diff = (mean_g - mu[obs_cols]).values.reshape(-1, 1)
                    cov_sub = cov.loc[obs_cols, obs_cols].values
                    inv_sub = la.pinv(cov_sub)
                    stat += group.shape[0] * float(diff.T @ inv_sub @ diff)
                    df_stat += len(obs_cols)
                df_stat -= len(numeric_cols)
                if df_stat > 0 and stats is not None:
                    p_value = 1.0 - stats.chi2.cdf(stat, df_stat)
                    mcar_result = {
                        "status": "ok",
                        "method": "little_mcar_approx",
                        "stat": stat,
                        "df": df_stat,
                        "p_value": p_value,
                        "decision": "likely_mcar" if p_value > 0.05 else "not_mcar",
                    }
                elif stats is None:
                    mcar_result["status"] = "scipy_unavailable"
                else:
                    mcar_result["status"] = "not_enough_patterns"
            else:
                mcar_result["status"] = "not_enough_complete_cases"
        except Exception as exc:
            mcar_result = {
                "status": "failed",
                "method": "little_mcar_approx",
                "error": str(exc),
            }

    tests["mcar"] = mcar_result

    # --- MAR heuristics: relationships between missingness and observed variables ---
    mar_associations = []
    if target_cols:
        for target in target_cols:
            miss = df_clean[target].isna().astype(int)
            for other in df_clean.columns:
                if other == target:
                    continue
                other_series = df_clean[other]
                if pd.api.types.is_numeric_dtype(other_series):
                    valid = other_series.notna()
                    if valid.sum() >= 10:
                        miss_valid = miss[valid]
                        other_valid = other_series[valid]
                        if miss_valid.nunique() > 1 and other_valid.nunique() > 1:
                            corr = miss_valid.corr(other_valid)
                            if pd.notna(corr) and abs(corr) >= 0.2:
                                mar_associations.append({
                                    "target": target,
                                    "other": other,
                                    "type": "numeric_corr",
                                    "metric": float(corr),
                                })
                else:
                    try:
                        import importlib
                        stats = None
                        if importlib.util.find_spec("scipy.stats") is not None:
                            stats = importlib.import_module("scipy.stats")
                        if stats is None:
                            continue
                        ct = pd.crosstab(miss, other_series)
                        if ct.shape[0] >= 2 and ct.shape[1] >= 2:
                            chi2_stat, p_val, _, _ = stats.chi2_contingency(ct)
                            if p_val <= 0.05:
                                mar_associations.append({
                                    "target": target,
                                    "other": other,
                                    "type": "chi2",
                                    "metric": float(p_val),
                                })
                    except Exception:
                        continue

    tests["mar_indicators"] = mar_associations

    # --- MNAR heuristic flag ---
    possible_mnar = False
    if mcar_result.get("decision") == "not_mcar" and len(mar_associations) == 0:
        possible_mnar = True
    tests["possible_mnar"] = possible_mnar

    report = {
        "thresholds": {"col_threshold": col_threshold, "row_threshold": row_threshold},
        "features_used": target_cols,
        "missing_features": missing_features,
        "dropped_columns": dropped_columns,
        "dropped_rows": dropped_rows,
        "missing_summary": missing_summary,
        "tests": tests,
        "recommendations": recommendations,
    }

    return df_clean, report


def normalize(df, label=None):
    """
    Normalize skewness for a label column or all numeric features.

    If label is provided, only that column is evaluated. Otherwise, all numeric
    features are evaluated. For each feature, the best transformation is chosen
    based on skewness closest to zero, and the transformed column is appended.
    """
    import pandas as pd
    import numpy as np
    import importlib

    df_out = df.copy()

    if label is not None:
        if label not in df_out.columns:
            raise ValueError(f"Label column '{label}' not found in dataframe.")
        target_cols = [label]
    else:
        target_cols = [c for c in df_out.columns if pd.api.types.is_numeric_dtype(df_out[c])]

    def _is_boolean_numeric(series):
        non_null = series.dropna()
        return not non_null.empty and non_null.isin([0, 1]).all() and non_null.nunique() <= 2

    def _make_unique(col_name):
        if col_name not in df_out.columns:
            return col_name
        i = 2
        while f"{col_name}_{i}" in df_out.columns:
            i += 1
        return f"{col_name}_{i}"

    def _safe_skew(series):
        valid = series.dropna()
        if valid.size < 3 or valid.nunique() <= 1:
            return None
        return float(valid.skew())

    def _valid_series(series):
        arr = series.to_numpy()
        return np.isfinite(arr).all()

    stats = None
    if importlib.util.find_spec("scipy.stats") is not None:
        stats = importlib.import_module("scipy.stats")

    for col in target_cols:
        series = df_out[col]
        if _is_boolean_numeric(series):
            continue

        base_skew = _safe_skew(series)
        if base_skew is None:
            continue

        candidates = []

        if base_skew >= 0:
            shift = 0.0
            min_val = series.min()
            if pd.notna(min_val) and min_val < 0:
                shift = -min_val
            sqrt_series = np.sqrt(series + shift)
            if _valid_series(sqrt_series):
                candidates.append(("sqrt", sqrt_series))

            cbrt_series = np.cbrt(series)
            if _valid_series(cbrt_series):
                candidates.append(("cbrt", cbrt_series))

            ln_shift = 0.0
            if pd.notna(min_val) and min_val <= 0:
                ln_shift = 1 - min_val
            ln_series = np.log(series + ln_shift)
            if _valid_series(ln_series):
                candidates.append(("ln", ln_series))
        else:
            square_series = np.power(series, 2)
            if _valid_series(square_series):
                candidates.append(("square", square_series))

            cube_series = np.power(series, 3)
            if _valid_series(cube_series):
                candidates.append(("cube", cube_series))

            with np.errstate(over="ignore", invalid="ignore"):
                exp_series = np.exp(np.clip(series, a_min=None, a_max=50))
            if _valid_series(exp_series):
                candidates.append(("exp", exp_series))

        if stats is not None:
            try:
                yj_transformed, _ = stats.yeojohnson(series.dropna())
                yj_series = pd.Series(yj_transformed, index=series.dropna().index)
                yj_full = pd.Series(index=series.index, dtype=float)
                yj_full.loc[yj_series.index] = yj_series
                if _valid_series(yj_full):
                    candidates.append(("yeojohnson", yj_full))
            except Exception:
                pass

        best_name = None
        best_series = None
        best_score = None
        for name, transformed in candidates:
            skew_val = _safe_skew(pd.Series(transformed, index=series.index))
            if skew_val is None:
                continue
            score = abs(skew_val)
            if best_score is None or score < best_score:
                best_score = score
                best_name = name
                best_series = transformed

        if best_name is None or best_series is None:
            continue

        new_col = _make_unique(f"{col}_{best_name}")
        df_out[new_col] = pd.Series(best_series, index=series.index)

    return df_out


def manage_outliers(
    df,
    eps=0.5,
    min_samples=5,
    drop_outliers=False,
    scale=True,
    features=None,
):
    """
    Identify outliers using DBSCAN and optionally drop them.

    Args:
        df: Pandas DataFrame.
        eps: DBSCAN epsilon; smaller is tighter, larger is looser.
        min_samples: Minimum samples in a neighborhood for a core point.
        drop_outliers: If True, drop rows flagged as outliers.
        scale: If True, standardize numeric features before clustering.
        features: Optional list of columns to use. Defaults to numeric columns.

    Returns:
        df_result: Updated DataFrame (optionally with outliers dropped).
        report_df: DataFrame with total outliers and primary cause counts.
    """
    import pandas as pd
    import numpy as np
    from sklearn.cluster import DBSCAN

    df_work = df.copy()

    if features is None:
        feature_cols = [c for c in df_work.columns if pd.api.types.is_numeric_dtype(df_work[c])]
    else:
        feature_cols = [c for c in features if c in df_work.columns]

    if not feature_cols:
        report_df = pd.DataFrame(
            {"metric": ["total_outliers"], "value": [0]}
        ).set_index("metric")
        return df_work, report_df

    data = df_work[feature_cols].copy()
    data = data.replace([np.inf, -np.inf], np.nan)

    medians = data.median()
    data = data.fillna(medians)

    if scale:
        means = data.mean()
        stds = data.std(ddof=0).replace(0, 1)
        data_scaled = (data - means) / stds
    else:
        data_scaled = data

    db = DBSCAN(eps=eps, min_samples=min_samples)
    labels = db.fit_predict(data_scaled)

    outlier_mask = labels == -1
    outlier_count = int(outlier_mask.sum())

    primary_cause_counts = {col: 0 for col in feature_cols}
    if outlier_count > 0:
        # Robust z-score to find primary cause per row
        med = data.median()
        mad = (data - med).abs().median().replace(0, 1)
        robust_z = (data - med).abs() / mad
        for idx in data.index[outlier_mask]:
            row = robust_z.loc[idx]
            if row.isna().all():
                continue
            primary_col = row.idxmax()
            if primary_col in primary_cause_counts:
                primary_cause_counts[primary_col] += 1

    report_rows = [{"metric": "total_outliers", "value": outlier_count}]
    for col in feature_cols:
        report_rows.append({"metric": col, "value": primary_cause_counts.get(col, 0)})
    report_df = pd.DataFrame(report_rows).set_index("metric")

    if drop_outliers and outlier_count > 0:
        df_work = df_work.loc[~outlier_mask].copy()

    return df_work, report_df
