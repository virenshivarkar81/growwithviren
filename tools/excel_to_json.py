import pandas as pd
import json

# ==================================================
# RESOURCES
# ==================================================

articles = pd.read_excel(
    'data/resources.xlsx',
    sheet_name='Articles'
)

questions = pd.read_excel(
    'data/resources.xlsx',
    sheet_name='Questions'
)

resources = []

for _, article in articles.iterrows():

    article_id = article['ArticleID']

    article_questions = questions[
        questions['ArticleID'] == article_id
    ]

    content = []

    for _, q in article_questions.iterrows():

        content.append({

            "heading": str(q["Question"]),

            "body": str(q["Answer"]),

            "codeType": ""
            if pd.isna(q.get("CodeType"))
            else str(q.get("CodeType")).strip(),

            "code": ""
            if pd.isna(q.get("Code"))
            else str(q.get("Code")).strip()
        })

    resources.append({

        "id": article_id,

        "title": article["Title"],

        "resourceGroup": article["ResourceGroup"],

        "tags": [
            tag.strip()
            for tag in str(article["Tags"]).split(",")
        ],

        "badge": article["Badge"],

        "summary": article["Summary"],

        "date": str(article["Date"])[:10],

        "readTime": article["ReadTime"],

        "featured": str(
            article["Featured"]
        ).strip().lower() == "yes",

        "content": content
    })

with open(
    'data/resources.json',
    'w',
    encoding='utf-8'
) as f:

    json.dump(
        resources,
        f,
        indent=2,
        ensure_ascii=False
    )

print(
    f"✓ {len(resources)} resources generated"
)


# ==================================================
# TESTIMONIALS
# ==================================================

# ==================================================
# TESTIMONIALS
# ==================================================

testimonials_df = pd.read_excel(
    'data/resources.xlsx',
    sheet_name='Testimonials'
)

testimonials = []

for _, row in testimonials_df.iterrows():

    testimonials.append({

        "id": int(row["ID"]),

        "initials": str(row["Initials"]).strip(),

        "name": str(row["Name"]).strip(),

        "role": str(row["Role"]).strip(),

        "company": str(row["Company"]).strip(),

        "quote": str(row["Quote"]).strip(),

        "featured": str(
            row["Featured"]
        ).strip().lower() == "yes",

        "linkedin": ""
        if pd.isna(row.get("LinkedIn"))
        else str(row["LinkedIn"]).strip()
    })

with open(
    'data/testimonials.json',
    'w',
    encoding='utf-8'
) as f:

    json.dump(
        testimonials,
        f,
        indent=2,
        ensure_ascii=False
    )

print(
    f"✓ {len(testimonials)} testimonials generated"
)

print("\n====================================")
print("✓ resources.json generated")
print("✓ testimonials.json generated")
print("====================================")