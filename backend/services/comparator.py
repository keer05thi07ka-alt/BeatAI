def compare_two_reports(report_prev, report_latest):
    """
    Compares previous and latest medical reports parameter by parameter.
    Outputs neutral trend direction and delta calculations.
    """
    prev_params = {p.name: p for p in report_prev.parameters}
    latest_params = {p.name: p for p in report_latest.parameters}

    comparison_results = []
    
    all_param_names = set(prev_params.keys()).union(set(latest_params.keys()))

    for name in sorted(all_param_names):
        p_prev = prev_params.get(name)
        p_latest = latest_params.get(name)

        unit = p_latest.unit if p_latest else (p_prev.unit if p_prev else "")
        ref_range = p_latest.reference_range if p_latest else (p_prev.reference_range if p_prev else "N/A")

        prev_val_str = p_prev.value_str if p_prev else "Not Tested"
        latest_val_str = p_latest.value_str if p_latest else "Not Tested"

        prev_num = p_prev.numerical_value if p_prev else None
        latest_num = p_latest.numerical_value if p_latest else None

        delta_str = "N/A"
        trend = "Stable"
        outside_ref = False

        if prev_num is not None and latest_num is not None:
            diff = round(latest_num - prev_num, 2)
            if diff > 0:
                delta_str = f"+{diff} {unit}"
                trend = "Increased"
            elif diff < 0:
                delta_str = f"{diff} {unit}"
                trend = "Decreased"
            else:
                delta_str = f"0 {unit}"
                trend = "Stable"
        
        if p_latest and p_latest.status != "Normal":
            outside_ref = True
            trend_note = f"{trend} (Currently outside reference range: {p_latest.status})"
        else:
            trend_note = trend

        comparison_results.append({
            "parameter_name": name,
            "category": p_latest.category if p_latest else p_prev.category,
            "previous_value": prev_val_str,
            "latest_value": latest_val_str,
            "unit": unit,
            "reference_range": ref_range,
            "difference": delta_str,
            "trend": trend,
            "trend_note": trend_note,
            "outside_reference_range": outside_ref,
            "latest_status": p_latest.status if p_latest else "N/A"
        })

    return {
        "report_previous": {
            "id": report_prev.id,
            "title": report_prev.title,
            "date": report_prev.report_date
        },
        "report_latest": {
            "id": report_latest.id,
            "title": report_latest.title,
            "date": report_latest.report_date
        },
        "comparisons": comparison_results,
        "summary": f"Compared report from {report_prev.report_date} with {report_latest.report_date}. Identified {len(comparison_results)} parameters for side-by-side tracking."
    }
