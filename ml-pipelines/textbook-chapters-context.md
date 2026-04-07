# Textbook context (Chapters 1–17)

**Source:** *Machine Learning in Python: From Data Collection to Model Deployment* (Mark Keith, Brigham Young University).  
**Local PDF:** `ml-pipelines/2026-03-10.13-35-35_Machine_Learning_in_Python_-_IS_455_W26.pdf`  
**Scope of this file:** Foreword + **Chapters 1 through 17** only. Chapter 18 (*Monitoring and Managing ML Pipelines*) exists in the book but is summarized only briefly here because it sits outside the 1–17 window you asked to standardize on.

**Purpose:** Give INTEX / IS 455 work a **single, textbook-aligned checklist** for notebooks and app integration. Use this alongside `ML_PIPELINES_CONTEXT.md` (project + dataset).

---

## How this maps to IS 455 “pipeline thinking”

The course description mirrors the book’s **end-to-end lifecycle** (Foreword §0.4). The textbook names eight stages:

1. **Problem framing** — business question, success metrics, **predictive vs explanatory** choice  
2. **Data acquisition**  
3. **Data preparation** (often the longest stage)  
4. **Exploration**  
5. **Modeling** (prediction, classification, causal estimation, etc.)  
6. **Evaluation** (metrics, validation, fairness)  
7. **Deployment**  
8. **Monitoring** (Chapter 18 in the book; still required for production maturity)

**Notebook requirement:** Each `.ipynb` should tell that story **in order**, with written analysis—not only code.

---

## Foreword (foundational, not “Chapter 0”)

### Core thesis

- ML is **not** a bag of algorithms; it is an **end-to-end decision system** (problem framing → deployed, maintained systems).
- The book emphasizes **pipeline thinking**: connect technical work to decisions, enforce evaluation discipline, build workflows that work outside the notebook.

### Two modeling goals (must keep separate)

**Predictive modeling**

- Optimize **out-of-sample** performance on new data.
- Judged by forecast accuracy, classification quality, ranking utility—not whether the internals match “true causality.”
- Flexible / less interpretable models can be appropriate when they improve accuracy and operational performance.

**Explanatory / causal-style modeling**

- Aims to **understand and quantify relationships**, ideally for defensible causal claims (with correct diagnostics and design).
- Judged by interpretability, assumption validity, and whether the structure matches a plausible data-generating story.
- A slightly worse predictive model can be preferable if coefficients/structure are clear and defensible.

**Failure modes called out in the text**

- Treating **accurate predictions as causal evidence**
- Producing **interpretable analyses that cannot be operationalized**

### How the book organizes chapters (pipeline stages)

The Foreword maps chapters to stages (abbreviated here):

- **Business case / methodology:** Chapter 1  
- **Data acquisition:** Chapters 4–5  
- **Data preparation:** Chapters 2–3 and 7 (pandas foundations + automated prep pipelines)  
- **Exploration:** Chapters 6 and 8 (univariate automation + relationship discovery)  
- **Modeling + evaluation + selection:** Chapters 9–16 (regression sequence, trees, classification, ensembles, CV/tuning, feature selection)  
- **Deployment:** Chapter 17  
- **Monitoring / lifecycle:** Chapter 18 (not in the 1–17 scope of this document)

**Reading order note:** Chapters 2–3 are foundational pandas skills used throughout later acquisition and preparation work.

---

## Chapter map (PDF page ranges, approximate)

Extracted from the PDF’s chapter title pages. Use these as **approximate** navigation anchors in the PDF.

| Chapter | Title | Approx. PDF pages |
|--------:|-------|-------------------|
| 1 | Data Mining Project Methodology | 35–56 |
| 2 | Pandas: DataFrames | 57–101 |
| 3 | Pandas: Data Wrangling | 102–133 |
| 4 | Pandas: Reading/Writing | 134–165 |
| 5 | Retrieving Data from APIs | 166–197 |
| 6 | Automating Feature-Level Exploration | 198–221 |
| 7 | Automating Data Preparation Pipelines | 222–295 |
| 8 | Automating Relationship Discovery | 296–321 |
| 9 | MLR Concepts and Mechanics | 322–369 |
| 10 | MLR Diagnostics for Causal Inference | 370–424 |
| 11 | MLR for Predictive Inference | 425–485 |
| 12 | Decision Trees for Predictive Regression | 486–536 |
| 13 | Classification Modeling | 537–596 |
| 14 | Ensemble Methods | 597–671 |
| 15 | Model Evaluation, Selection & Tuning | 672–783 |
| 16 | Feature Selection | 784–845 |
| 17 | Deploying ML Pipelines | 846–892 |

---

## Chapter 1 — Data Mining Project Methodology

### Role in the pipeline

Establishes **CRISP-DM** as the iterative project framework: business understanding → data understanding → preparation → modeling → evaluation → deployment, with **data at the center** and frequent revisiting of earlier phases.

### Official learning objectives (paraphrased)

- Explain the **six CRISP-DM phases** and how data influences each phase.  
- Evaluate feasibility by **impact**, **data availability**, and **analytical feasibility**.  
- Distinguish **decision-support (explanatory)** projects **vs** **machine-learning pipeline (predictive)** projects and choose the right approach.  
- Compare CRISP-DM to **TDSP, SEMMA, KDD, OSEMN** (strengths/limitations).  
- Explain the phases of CRISP-DM (course-level outcome).

### CRISP-DM six phases (as stated in chapter text)

1. Business understanding — problem, objectives, success criteria  
2. Data understanding — sources, exploration, quality  
3. Data preparation — clean, transform, organize for analysis/modeling  
4. Modeling — techniques, algorithms, features  
5. Evaluation — performance vs business objectives and baselines  
6. Deployment — deliver results / integrate into operations  

**Key idea:** not a linear checklist; iterations are normal as new constraints appear.

### Sections (outline)

1.1 Introduction · 1.2 Business understanding · 1.3 Data understanding · 1.4 Data preparation · 1.5 Modeling · 1.6 Evaluation · 1.7 Deployment · 1.8 Alternative frameworks · 1.9 Types of data projects · 1.10 Reading quiz

### INTEX checklist

- Write explicit **business problem**, **stakeholders**, and **success metrics** before modeling.  
- State **predictive vs explanatory** intent up front.

---

## Chapter 2 — Pandas: DataFrames

### Role

Core tabular data structure for **everything downstream**.

### Learning objectives (paraphrased)

- Build DataFrames from dicts/lists/files.  
- Index with `.loc` / `.iloc`.  
- Add rows/columns (assignment, `.insert()`, `.join()`, `.merge()`).  
- Distinguish **index-based joins** (`join`) vs **key-based merges** (`merge`).

### Sections (outline)

2.1 Introduction · 2.2 Creating DataFrames · 2.3 Reading DataFrames · 2.4 Modifying DataFrames · 2.5 Filtering · 2.6 Sorting · 2.7 Practice · 2.8 Assignment

---

## Chapter 3 — Pandas: Data Wrangling

### Role

Transforms and feature creation at scale (vectorized, not row loops).

### Learning objectives (paraphrased)

- Iterate when needed (`.itertuples`, `.iterrows`, `.items`) but prefer vectorization.  
- Vectorized math across columns.  
- Recode categories with `.map()` / `.replace()`.  
- Create derived features via vectorized operations.

### Sections (outline)

3.1 Introduction · 3.2 Iterating · 3.3 Vectorized calculations · 3.4 Relabel values · 3.5 Dates · 3.6 Practice · 3.7 Assignment

---

## Chapter 4 — Pandas: Reading/Writing

### Role

**Data acquisition** from files and local databases.

### Learning objectives (paraphrased)

- Read CSV/Excel/JSON/SQLite with appropriate options.  
- Construct correct relative/absolute paths (including cloud mounts).  
- Write DataFrames to CSV/Excel/JSON/SQLite.  
- Create/query SQLite; use `.to_sql()` and `pd.read_sql()`.

### Sections (outline)

4.1 Introduction · 4.2 Reading files · 4.3 Writing files · 4.4 JSON · 4.5 SQLite · 4.6 Optional live SQL · 4.7 Practice · 4.8 Assignment

---

## Chapter 5 — Retrieving Data from APIs

### Role

**Programmatic acquisition** from REST APIs.

### Learning objectives (paraphrased)

- HTTP GET with `requests`; interpret status codes.  
- Parse nested JSON.  
- Query strings, filters, pagination.  
- Pagination loops for full datasets.  
- Responses → DataFrames.

### Sections (outline)

5.1 Introduction · 5.2 Web service APIs · 5.3 In Python · 5.4 Earthquakes · 5.5 Key auth · 5.6 Headers/body · 5.7 Stocks · 5.8 ESPN NBA · 5.9 Practice · 5.10 Assignment

---

## Chapter 6 — Automating Feature-Level Exploration

### Role

**Univariate** exploration at dataset scale (automation + reusable functions).

### Learning objectives (paraphrased)

- Functions that iterate columns and compute type-appropriate stats.  
- Branching logic for numeric vs categorical paths.  
- Robust code for varying schemas.  
- Package utilities in modules for reuse.

### Sections (outline)

6.1 Introduction · 6.2 What is automation? · 6.3 Automating univariate stats · 6.4 Practice · 6.5 Homework

---

## Chapter 7 — Automating Data Preparation Pipelines

### Role

The **reproducible prep** stage: cleaning, transformations, missing-data strategy, outliers—aligned with CRISP-DM “Data Preparation.”

### Learning objectives (paraphrased)

- Automated cleaning: invalid columns, names, dtypes.  
- Skew transforms: log, sqrt, **Yeo-Johnson**, **Box-Cox**.  
- Missing data strategies (impute/remove) with explicit assumptions (e.g. **MAR** discussed in chapter).  
- AI-assisted coding for generalized functions (still analyst-validated).  
- Binning numeric variables; rare category consolidation.

### Sections (outline)

7.1 Introduction · 7.2 Wrangling · 7.3 Dates/times · 7.4 Binning · 7.5 Math transforms · 7.6 Missing data · 7.7 Outliers · 7.8 Summary/guidance · 7.9 Assignment

### INTEX checklist

- Treat prep as **code + tests**, not one-off notebook cells.  
- Document **missingness** and **outlier** handling decisions.

---

## Chapter 8 — Automating Relationship Discovery

### Role

**Bivariate / multivariate** exploration automation (stats + plots + controller pattern).

### Learning objectives (paraphrased)

- Four relationship types (numeric–numeric, cat–cat, numeric–cat, cat–numeric) and appropriate stats.  
- Automate Pearson, chi-square, ANOVA F as appropriate.  
- Matching visuals (scatter, bar, heatmaps).  
- Controller integrating all relationship types.

### Sections (outline)

8.1 Introduction · 8.2 Statistics function · 8.3 Visualization functions · 8.4 Controller function · 8.5 Practice · 8.6 Assignment

---

## Chapter 9 — MLR Concepts and Mechanics

### Role

Introduces **multiple linear regression** as the first serious model: mechanics, interpretation, **dummy coding**, standardization, baseline metrics.

### Learning objectives (paraphrased)

- Conditional effects / holding other variables constant.  
- MLR in Excel + Python (**statsmodels**); coefficients, p-values, R².  
- Dummy coding with **reference category dropped**.  
- Standardize numeric features for comparable coefficient magnitudes.  
- In-sample **MAE, RMSE**.

### Sections (outline)

9.1 Introduction · 9.2 Linear regression · 9.3 MLR · 9.4 MLR in Excel · 9.5 MLR in Python · 9.6 Feature estimates · 9.7 Categorical variables · (practice/case studies follow in text)

### INTEX checklist

- For explanatory work, **coefficients are not “causes”** without diagnostics and design (Ch. 10).

---

## Chapter 10 — MLR Diagnostics for Causal Inference

### Role

**Explanatory inference** quality: when you can trust coefficients and intervals.

### Learning objectives (paraphrased)

- Five core assumptions: **normality, multicollinearity, autocorrelation, linearity, homoscedasticity** (diagnostic tests + plots).  
- Multicollinearity: heatmaps + **VIF**.  
- Transformations: log / Box-Cox / Yeo-Johnson for residual issues.  
- Linearity: residual vs fitted; polynomials/transforms.  
- Explain why diagnostics are **essential for valid causal inference** but **less critical for purely predictive** modeling (ties directly to Ch. 11).

### Sections (outline)

10.1 Introduction · 10.2 Diagnostics overview · 10.3 Normality · 10.4 Multicollinearity · 10.5 Autocorrelation · 10.6 Linearity · 10.7 Heteroscedasticity · 10.8 Diagnostic-adjusted model · 10.9 Case studies · 10.10 Assignment

### INTEX checklist

- Social-media notebook framed as **explanatory/causal** should use **diagnostics + humility about causality** (confounding, hidden variables).

---

## Chapter 11 — MLR for Predictive Inference

### Role

Same algorithm (MLR), **different goal**: **generalization** to new data.

### Learning objectives (paraphrased)

- How predictive goals differ from causal/explanatory goals.  
- Train/test splits for out-of-sample performance and overfitting control.  
- **sklearn pipelines** that fit preprocessing on **training only**.  
- sklearn regression + **MAE/RMSE** on holdout data.  
- Data readiness: missingness, feature types, **target leakage** prevention.

### Sections (outline)

11.1 Introduction · 11.2 Causal → prediction · 11.3 Data prep · 11.4 Assumptions (predictive lens) · 11.5 Train/test splits · 11.6 `Pipeline` in sklearn · 11.7 MLR in sklearn · 11.8 Metrics · 11.9 Greedy backward feature removal · 11.10 Predictions · 11.11 Case studies · 11.12 Assignment

### INTEX checklist

- Donor retention + girls-at-risk notebooks should emphasize **leakage** and **proper validation** (Ch. 15 expands).

---

## Chapter 12 — Decision Trees for Predictive Regression

### Role

Nonlinear predictive models for **numeric outcomes** with interpretable splits and **feature importance**.

### Learning objectives (paraphrased)

- Recursive partitioning / split criteria.  
- Train regression trees in sklearn; visualize paths.  
- Impurity-based importance.  
- Regularize with `max_depth`, `min_samples_split`, `min_samples_leaf`.

### Sections (outline)

12.1 Introduction · 12.2 How trees predict · 12.3 Training · 12.4 Visualization · 12.5 Feature importance · 12.6 Overfitting/regularization · 12.7 Hyperparameters · 12.8 Strengths/weaknesses · 12.9 Case studies · 12.10 Assignment

---

## Chapter 13 — Classification Modeling

### Role

**Categorical outcomes** — logistic regression, classification trees, metrics, multiclass.

### Learning objectives (paraphrased)

- Logistic regression + calibrated probabilities / log-odds.  
- Classification trees (Gini/entropy).  
- Metrics: accuracy, precision, recall, F1, AUC, log loss.  
- Stratified splits + sklearn pipelines for classification.  
- Compare log reg vs trees for business fit.

### Sections (outline)

13.1 Introduction · 13.2 Problem setup · 13.3 Logistic regression · 13.4 Tree classification · 13.5 Visualizing trees · 13.6 Classification metrics · 13.7 Multiclass · 13.8 Log reg vs trees · 13.9 Other algorithms · 13.10 Case studies · 13.11 Learning objectives · 13.12 Assignment

### INTEX checklist

- Likely **primary toolkit** for donor retention + at-risk girls if targets are binary.

---

## Chapter 14 — Ensemble Methods

### Role

**Bagging, boosting, stacking** (variance/bias reduction; often best accuracy).

### Learning objectives (paraphrased)

- Why ensembles reduce error (variance vs bias framing).  
- Random forests + key hyperparameters.  
- Gradient boosting (incl. XGBoost).  
- Stacking with meta-learners.  
- Compare singles vs ensembles via CV; choose pragmatically.

### Sections (outline)

14.1 Introduction · 14.2 Baselines · 14.3 Bagging · 14.4 Random forests · 14.5 AdaBoost · 14.6 Gradient boosting · 14.7 Stacking · 14.8 Ensembles for regression · 14.9 Tradeoffs/interpretability · 14.10 When not to use ensembles · 14.11 Case studies · 14.12 Learning objectives · 14.13 Assignment

---

## Chapter 15 — Model Evaluation, Selection & Tuning

### Role

Professional evaluation: **CV**, **curves**, **tuning**, **nested CV** for honest estimates.

### Learning objectives (paraphrased)

- CV strategies: KFold, **StratifiedKFold**, **GroupKFold**, **TimeSeriesSplit** as appropriate.  
- Learning curves + validation curves (under/overfitting diagnostics).  
- `GridSearchCV` / `RandomizedSearchCV` under budgets.  
- Nested CV for unbiased final performance estimates.

### Sections (outline)

15.1 Introduction · 15.2 Cross-validation · 15.3 CV in practice · 15.4 Learning curves · 15.5 Validation curves · 15.6 Hyperparameter tuning · 15.7 Model selection · (case studies continue)

### INTEX checklist

- For classification: **stratified** CV; for time-ordered donor behavior: consider **time-based** split logic.  
- Compare models **fairly** (same folds, same preprocessing).

---

## Chapter 16 — Feature Selection

### Role

**Different selection philosophy** for causal vs predictive projects.

### Learning objectives (paraphrased)

- **Causal selection** (coefficient validity) vs **predictive selection** (out-of-sample performance).  
- Filters: variance thresholds, univariate tests, correlation screening.  
- Wrappers: RFECV / sequential selection.  
- Embedded methods + **permutation importance** + **VIF** in causal context.  
- Feature selection **inside pipelines** to prevent leakage.

### Sections (outline)

16.1 Introduction · 16.2 Two paradigms · 16.3 Filters · 16.4 Wrappers · 16.5 Embedded · 16.6 Permutation importance · 16.7 Causal feature selection · 16.8 Selection inside pipelines · 16.9 Decision framework · 16.10 Case studies · 16.11 Assignment

### INTEX checklist

- Explanatory notebook: justify **why** a feature is in/out (confounding, multicollinearity, interpretability).  
- Predictive notebook: justify **generalization** impact.

---

## Chapter 17 — Deploying ML Pipelines

### Role

Turning notebooks into **operational** systems: **ETL**, **train**, **infer**, **serialize**, **schedule**.

### Learning objectives (paraphrased)

- Architectures with **separate training vs inference** paths.  
- ETL from operational systems into analytics-ready tables.  
- Serialize with **joblib** + training metadata / versioning.  
- Inference pipelines that load models and score new rows.  
- Scheduled retraining jobs.

### Sections (outline)

17.1 Introduction · 17.2 Deployment architecture · 17.3 End-to-end pipeline · 17.4 ETL · 17.5 Training · 17.6 Inference · 17.7 Scheduled jobs · (additional material follows in the chapter)

### INTEX checklist

- Every notebook ends with **Deployment Notes** aligned to the .NET + React app (API + UI surfacing).

---

## How this should shape each INTEX notebook

### Minimum “textbook-faithful” structure

1. **Problem framing** — business question, stakeholder, metrics, predictive vs explanatory.  
2. **Data acquisition & preparation** — joins documented; reproducible prep.  
3. **Exploration** — distributions, relationships, anomalies; inform modeling.  
4. **Modeling** — choose tools consistent with **goal** (Ch. 9–11 vs 12–14).  
5. **Evaluation** — proper validation (Ch. 15); interpret errors in nonprofit terms.  
6. **Feature selection** — causal vs predictive logic (Ch. 16).  
7. **Deployment notes** — how the app consumes outputs (Ch. 17).

### Course-specific requirement (from your IS 455 prompt)

The assignment asks each pipeline to include **both causal and predictive** work. A practical textbook-aligned pattern:

- **Donor retention** (`donor-retention.ipynb`): primary = **predictive** (Ch. 11–15 + 13); add **explanatory** companion (e.g., interpretable model + diagnostics Ch. 10 for drivers of lapse/retention).  
- **Girls at risk** (`girls-at-risk.ipynb`): primary = **predictive** (Ch. 13–15); add **explanatory** companion (drivers of risk / incidents with careful interpretation).  
- **Social media effectiveness** (`social-media-effectiveness.ipynb`): primary = **explanatory** (Ch. 9–10 + diagnostics + careful language); add **predictive** companion (predict engagement for operational forecasting) if you need to satisfy the “both” wording **and** stay aligned with the chapter split.

---

## Chapter 18 (outside 1–17 scope, but part of full lifecycle)

- **Monitoring, drift, retraining, retirement** — required for production maturity; pair Chapter 17 deployment with Chapter 18 when you harden the system after sprint 1.

---

## Maintenance

When the PDF is updated or replaced, re-run page-range verification against the chapter title pages and adjust the table in **Chapter map** if needed.
