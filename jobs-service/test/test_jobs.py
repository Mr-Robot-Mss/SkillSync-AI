from app.services.jobs_service import calculate_match, add_default_match


def test_calculate_match_for_qa_role():
    job = {
        "title": "QA Automation Engineer",
        "category": "QA"
    }

    result = calculate_match("QA Automation", job)

    assert result == 94


def test_calculate_match_for_backend_role():
    job = {
        "title": "Backend Developer Python",
        "category": "Backend"
    }

    result = calculate_match("Backend Developer", job)

    assert result == 94


def test_calculate_match_returns_medium_match_for_valid_tech_category():
    job = {
        "title": "Software Engineer",
        "category": "Frontend"
    }

    result = calculate_match("Data Analyst", job)

    assert result == 78


def test_calculate_match_returns_low_match_for_unknown_category():
    job = {
        "title": "Marketing Assistant",
        "category": "Marketing"
    }

    result = calculate_match("QA Automation", job)

    assert result == 65


def test_add_default_match_when_missing():
    job = {
        "title": "QA Tester"
    }

    result = add_default_match(job)

    assert result["match"] == 75
    assert result["title"] == "QA Tester"