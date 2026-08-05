import streamlit as st
from google import genai

# Page Configuration for Mobile Screens
st.set_page_config(
    page_title="DBM 30263 Learning Assistant",
    page_icon="📊",
    layout="centered"
)

st.title("📊 DBM 30263 Learning Assistant")
st.caption("Politeknik Malaysia — Jabatan Matematik, Sains & Komputer (JMSK)")

# Retrieve API Key from Streamlit Secrets
api_key = st.secrets.get("GEMINI_API_KEY")

if not api_key:
    st.error("Missing GEMINI_API_KEY. Please set it in Streamlit Secrets.")
    st.stop()

client = genai.Client(api_key=api_key)

# ---------------------------------------------------------
# OFFICIAL DBM 30263 SYLLABUS MAPPING (4 CHAPTERS)
# ---------------------------------------------------------
SYLLABUS_TOPICS = {
    "1.0 Introduction to Statistics": [
        "1.1 Concepts (Def, Descriptive vs Inferential, Population vs Sample, Variables, Scales of Measurement)",
        "1.2 Data Organization (Raw data, Frequency table, Relative frequency & Percentage distribution)",
        "1.3 Numerical Descriptive Measures (Ungrouped: Mean, Median, Mode, Range, Variance, Std Dev)",
        "1.4 Probability of Sample Data (Experiment, Sample space, Mutually Exclusive, Independent, Addition & Multiplication Rules)"
    ],
    "2.0 Probability Distributions": [
        "2.1 Types of Random Variables (Discrete vs Continuous)",
        "2.2 Discrete Probability Distributions (Tables, E(X), Std Dev, Binomial Distribution)",
        "2.3 Continuous Probability Distributions (Normal Distribution, Z-score concept & applications)",
        "2.4 Normal Approximation to Binomial Distribution (Basic cases)"
    ],
    "3.0 Sampling and Estimation": [
        "3.1 Sampling Concepts (Random/Non-random, Central Limit Theorem, Sampling Errors, Mean & Std Dev)",
        "3.2 Estimation Concepts (Point vs Interval estimates, Confidence Intervals for Mean & Proportion)",
        "3.2.6 Large Samples Interval Estimation (Z-distribution, Maximum Error)",
        "3.2.7 Small Samples Interval Estimation (t-distribution, Degrees of Freedom)"
    ],
    "4.0 Hypothesis Testing": [
        "4.1 Hypothesis Test Concepts (Null vs Alternative, Type I & Type II Errors, Rejection regions, 1-tailed/2-tailed)",
        "4.2.1-4.2.2 Testing Population Mean: Large Samples (5-step process using Z-test)",
        "4.2.3 Testing Population Mean: Small Samples (Using t-distribution)"
    ]
}

# Sidebar Navigation
with st.sidebar:
    st.header("📋 Official Syllabus Focus")
    st.markdown("Select topic to ensure answers follow **Politeknik JMSK** exam marking schemes:")
    
    selected_chapter = st.selectbox("Select Chapter:", list(SYLLABUS_TOPICS.keys()))
    selected_subtopic = st.selectbox("Select Subtopic:", SYLLABUS_TOPICS[selected_chapter])

# Dynamic System Instruction incorporating the exact syllabus chapter
SYSTEM_INSTRUCTION = f"""
You are "MADAM FI", an authentic, highly encouraging, and expert academic AI tutor for Politeknik Malaysia students taking DBM 30263 (Statistics & Probability) under JMSK.

The student is asking a question regarding:
- Syllabus Chapter: {selected_chapter}
- Focus Subtopic: {selected_subtopic}

Guidelines for step-by-step solutions:
1. Adhere strictly to the official Politeknik Malaysia DBM 30263 syllabus methods, terminology, and notation.
2. For Chapter 1: Clearly differentiate measurement scales (Nominal, Ordinal, Interval, Ratio) or show step-by-step formula substitutions for mean/variance.
3. For Chapter 2: State clear probability rules (Addition, Multiplication, Conditional) or Binomial/Normal formulas with Z-table lookup steps.
4. For Chapter 3: Clearly specify whether Z-distribution (large samples) or t-distribution (small samples with df = n - 1) is used for Confidence Intervals.
5. For Chapter 4: Follow the official 5-step hypothesis testing format:
   - Step 1: State $H_0$ and $H_1$
   - Step 2: Select distribution ($Z$ or $t$)
   - Step 3: Determine critical value(s) and rejection region
   - Step 4: Calculate test statistic value
   - Step 5: Make decision and state final conclusion in context.
6. Format math neatly using standard LaTeX formatting (e.g., $H_0$, $\\mu$, $\\bar{{x}}$, $\\sigma$).
7. Keep explanations supportive, clear, and focused on helping students earn full marks in Continuous Assessments (PB) and Final Exams.
"""

# Input UI
st.subheader(f"📌 Topic: {selected_subtopic}")
user_question = st.text_area(
    "Enter your tutorial or past-year question:",
    placeholder="e.g., A sample of 36 students has a mean mark of 65 with standard deviation of 8. Construct a 95% confidence interval for the population mean...",
    height=150
)

if st.button("Solve Step-by-Step", type="primary"):
    if user_question:
        with st.spinner("Analyzing against DBM 30263 marking scheme..."):
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_question,
                config={"system_instruction": SYSTEM_INSTRUCTION}
            )
            st.markdown("### 📝 Step-by-Step Solution")
            st.markdown(response.text)
    else:
        st.warning("Please enter a question first.")
