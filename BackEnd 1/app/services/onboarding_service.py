def analyze_profile(data):
    scores = {
        "Data Analyst": data["data"] * 3 + data["programming"],
        "QA Automation": data["programming"] * 2 + data["data"] * 2,
        "Software Developer": data["programming"] * 3,
        "Product Manager": data["leadership"] * 3,
        "UX/UI Designer": data["design"] * 3,
        "DevOps Engineer": data["infrastructure"] * 3,
    }

    sorted_scores = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    primary_role = sorted_scores[0][0]
    secondary_role = sorted_scores[1][0]

    return {
        "primary_role": primary_role,
        "secondary_role": secondary_role,
        "compatibility": min(sorted_scores[0][1] * 10, 99)
    }