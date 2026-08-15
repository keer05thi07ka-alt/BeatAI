import requests

def test_user_isolation():
    url = "http://127.0.0.1:8000/api"
    
    headers_a = {"X-User-Email": "sarah.smith@example.com"}
    headers_b = {"X-User-Email": "john.doe@example.com"}

    # 1. Sarah uploads a report
    r_up = requests.post(
        f"{url}/reports/upload",
        headers=headers_a,
        files={"file": ("Sarah_BloodTest.pdf", b"Blood Glucose: 95 mg/dL", "application/pdf")}
    ).json()
    sarah_report_id = r_up["id"]
    print(f"Sarah uploaded report ID: {sarah_report_id}, email: {r_up['user_email']}")

    # 2. John queries /api/reports
    john_reports = requests.get(f"{url}/reports", headers=headers_b).json()
    print(f"John's report count: {len(john_reports)}")

    # 3. Sarah queries /api/reports
    sarah_reports = requests.get(f"{url}/reports", headers=headers_a).json()
    print(f"Sarah's report count: {len(sarah_reports)}")

    # 4. John attempts cross-account access to Sarah's report ID
    leak_res = requests.get(f"{url}/reports/{sarah_report_id}", headers=headers_b)
    print(f"John's cross-account access attempt status: {leak_res.status_code} ({leak_res.json()})")

    assert len(john_reports) == 0, "Security Failure: John sees Sarah's reports!"
    assert len(sarah_reports) >= 1, "Sarah's report missing!"
    assert leak_res.status_code == 404, "Security Failure: Cross account access permitted!"

    print("\nSUCCESS: Multi-tenant data isolation verified! Reports are 100% private per email account.")

if __name__ == "__main__":
    test_user_isolation()
