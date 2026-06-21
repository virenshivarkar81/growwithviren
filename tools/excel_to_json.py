import pandas as pd
import json


# ==================================================
# HELPERS
# ==================================================

def clean(value):
    return "" if pd.isna(value) else str(value).strip()


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

            "heading": clean(q["Question"]),

            "body": clean(q["Answer"]),

            "codeType": clean(q.get("CodeType")),

            "code": clean(q.get("Code"))

        })

    resources.append({

        "id": clean(article["ArticleID"]),

        "title": clean(article["Title"]),

        "resourceGroup": clean(article["ResourceGroup"]),

        "tags": [
            tag.strip()
            for tag in clean(article["Tags"]).split(",")
            if tag.strip()
        ],

        "badge": clean(article["Badge"]),

        "summary": clean(article["Summary"]),

        "date": str(article["Date"])[:10]
        if not pd.isna(article["Date"])
        else "",

        "readTime": clean(article["ReadTime"]),

        "featured": clean(
            article["Featured"]
        ).lower() == "yes",

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

testimonials_df = pd.read_excel(
    'data/resources.xlsx',
    sheet_name='Testimonials'
)

testimonials = []

for _, row in testimonials_df.iterrows():

    testimonials.append({

        "id": int(row["ID"]),

        "initials": clean(row["Initials"]),

        "name": clean(row["Name"]),

        "role": clean(row["Role"]),

        "company": clean(row["Company"]),

        "quote": clean(row["Quote"]),

        "featured": clean(
            row["Featured"]
        ).lower() == "yes",

        "linkedin": clean(
            row.get("LinkedIn")
        )

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