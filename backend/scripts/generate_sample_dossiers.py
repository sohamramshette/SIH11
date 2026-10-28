"""
Generates high-fidelity statutory dummy PDF documents for AICTE VerifyAI testing.
Covers the Golden 5 Dossiers:
1. Land Title Deed (Land Ownership)
2. Fire Safety NOC - Genuine (Fire Safety)
3. Fire Safety NOC - Tampered (Forensic Tamper Demonstration)
4. Faculty Roster & Salary Statement (Faculty)
5. Master Building Plan & PWD Structural Safety (Building)
6. University Affiliation Letter (Affiliation)
"""
import os
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line

OUTPUT_DIR = Path("sample_documents")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_government_header(canvas, doc, title_text, state_text="GOVERNMENT OF MADHYA PRADESH"):
    """Draws an authentic institutional / government header banner."""
    canvas.saveState()
    # Outer decorative border
    canvas.setStrokeColor(colors.HexColor("#102D52"))
    canvas.setLineWidth(2)
    canvas.rect(20, 20, doc.pagesize[0] - 40, doc.pagesize[1] - 40)
    
    # Inner thin border
    canvas.setStrokeColor(colors.HexColor("#C28935"))
    canvas.setLineWidth(0.75)
    canvas.rect(24, 24, doc.pagesize[0] - 48, doc.pagesize[1] - 48)

    canvas.restoreState()


def create_land_deed():
    pdf_path = OUTPUT_DIR / "01_Land_Title_Deed_Genuine.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'GovTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        alignment=1,
        textColor=colors.HexColor("#102D52"),
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        'GovSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        alignment=1,
        textColor=colors.HexColor("#8C2A1E"),
        spaceAfter=12,
    )
    body_style = ParagraphStyle(
        'GovBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
    )
    legal_style = ParagraphStyle(
        'GovLegal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )

    elements = [
        Spacer(1, 10),
        Paragraph("GOVERNMENT OF MADHYA PRADESH", title_style),
        Paragraph("DEPARTMENT OF REGISTRATION & REVENUE STAMPS", sub_style),
        Paragraph("<b>OFFICE OF THE SUB-REGISTRAR, DISTRICT HUZUR, BHOPAL</b>", ParagraphStyle('SubReg', parent=sub_style, fontSize=9, textColor=colors.HexColor("#334155"))),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#102D52"), spaceBefore=4, spaceAfter=14),
        Paragraph("<b>CERTIFIED COPY OF REGISTERED INDENTURE OF TITLE DEED & NON-ENCUMBRANCE</b>", ParagraphStyle('Indenture', parent=title_style, fontSize=11, textColor=colors.HexColor("#102D52"), spaceAfter=12)),
        Paragraph("<b>Document Serial No:</b> BPL-REG-2021-9844 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Book No:</b> 1 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Volume No:</b> 4128 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Pages:</b> 84 to 98", legal_style),
        Paragraph("<b>Date of Registration:</b> 14th September 2021 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Stamp Duty Paid:</b> ₹ 14,85,000 (Challan MP-841920)", legal_style),
        Spacer(1, 10),
    ]

    # Property Particulars Table
    data = [
        [Paragraph("<b>Statutory Property Parameter</b>", legal_style), Paragraph("<b>Certified Official Specification</b>", legal_style)],
        [Paragraph("<b>Registered Title Holder:</b>", legal_style), Paragraph("Bhartiya Vidya & Technical Education Society<br/>(Holding for Bhartiya Institute of Technology & Science)", legal_style)],
        [Paragraph("<b>Nature of Ownership:</b>", legal_style), Paragraph("Freehold Clear Title (Absolute Ownership)", legal_style)],
        [Paragraph("<b>Total Land Area:</b>", legal_style), Paragraph("<b>7.50 Acres</b> (Equivalent to 30,351.42 Square Meters)", legal_style)],
        [Paragraph("<b>Revenue Survey / Khasra Nos:</b>", legal_style), Paragraph("Khasra Nos. <b>402/1, 402/2, 403</b>", legal_style)],
        [Paragraph("<b>Village & Revenue Circle:</b>", legal_style), Paragraph("Village Khajuri Kalan, Tehsil Huzur, Bhopal District (M.P.)", legal_style)],
        [Paragraph("<b>Land Contiguity Certification:</b>", legal_style), Paragraph("<b>Contiguous: Yes</b> (Single undivided compact parcel without public road division)", legal_style)],
        [Paragraph("<b>Encumbrance & Mortgage Status:</b>", legal_style), Paragraph("<b>Clear & Free from all Encumbrances</b> (Non-Encumbrance verified for 30 years)", legal_style)],
        [Paragraph("<b>Approved Land Use / Zoning:</b>", legal_style), Paragraph("Institutional / Educational Higher Education Campus", legal_style)],
    ]

    t = Table(data, colWidths=[200, 310])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.extend([
        Spacer(1, 14),
        Paragraph("<b>STATUTORY ATTESTATION & COVENANT:</b><br/>"
                  "This is to certify that the land specified hereinabove is in actual peaceful physical possession of the said "
                  "registered society for the establishment and operation of technical education programs. The schedule boundaries "
                  "match the certified revenue demarcation map verified by Tehsildar Huzur. The property fulfills the mandatory minimum "
                  "land norms under AICTE Approval Process Handbook (APH 2026-27).", body_style),
        Spacer(1, 25),
    ])

    # Signatures
    sig_data = [
        [
            Paragraph("<b>[OFFICIAL RUBBER STAMP]</b><br/>SUB-REGISTRAR OFFICE<br/>HUZUR, BHOPAL (M.P.)<br/>GOVERNMENT SEAL #419", ParagraphStyle('Seal', parent=legal_style, alignment=1, textColor=colors.HexColor("#102D52"))),
            Paragraph("<b>Sub-Registrar (Class-I)</b><br/>Registration & Stamps Dept.<br/>Bhopal, Madhya Pradesh<br/>Digital Verification Code: <b>MP-REG-841920-VERIFIED</b>", ParagraphStyle('Sig', parent=legal_style, alignment=1)),
        ]
    ]
    st = Table(sig_data, colWidths=[250, 260])
    st.setStyle(TableStyle([
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor("#102D52")),
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#F8FAFC")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(st)

    doc.build(elements, onFirstPage=lambda c, d: draw_government_header(c, d, "LAND TITLE DEED"))
    print(f"Created: {pdf_path}")


def create_fire_noc(tampered: bool = False):
    suffix = "_Tampered" if tampered else "_Genuine"
    pdf_path = OUTPUT_DIR / f"02_Fire_Safety_NOC{suffix}.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'FireTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        alignment=1,
        textColor=colors.HexColor("#8C2A1E"),
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        'FireSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        alignment=1,
        textColor=colors.HexColor("#102D52"),
        spaceAfter=12,
    )
    legal_style = ParagraphStyle(
        'FireLegal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
    )

    # In tampered version: Expiry date was altered from 2024 to 2027 with anomalous styling!
    noc_num = "FS-NOC-2025-4819" if not tampered else "FS-NOC-2021-9920-ALT"
    validity_date = "31-03-2027" if not tampered else "31-03-2027 [MODIFIED FROM 2024]"
    validity_text = "<b>31st March 2027</b>" if not tampered else "<font color='#B91C1C'><b>31st March 2027</b></font> *(Altered font metric / overlay)*"
    status_comment = "Compliant with NBC 2016 Part IV" if not tampered else "Suspected Digital Stamp Replacement / Splice"

    elements = [
        Spacer(1, 10),
        Paragraph("DIRECTORATE OF FIRE & EMERGENCY SERVICES", title_style),
        Paragraph("STATE DISASTER MANAGEMENT & FIRE SAFETY ACADEMY", sub_style),
        Paragraph("<b>DIVISIONAL FIRE HEADQUARTERS, BHOPAL REGION</b>", ParagraphStyle('Div', parent=sub_style, fontSize=9, textColor=colors.HexColor("#475569"))),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#8C2A1E"), spaceBefore=4, spaceAfter=14),
        Paragraph("<b>NO OBJECTION CERTIFICATE FOR FIRE SAFETY & LIFE HAZARD CLEARANCE</b>", ParagraphStyle('NOCHead', parent=title_style, fontSize=11, textColor=colors.HexColor("#8C2A1E"), spaceAfter=12)),
        Paragraph(f"<b>NOC Certificate Number:</b> <b>{noc_num}</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Dispatch No:</b> FSD/BPL/2025/1104", legal_style),
        Paragraph("<b>Date of Statutory Inspection:</b> 08th April 2025 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Date of Issuance:</b> 15th April 2025", legal_style),
        Spacer(1, 10),
    ]

    data = [
        [Paragraph("<b>Fire Safety Inspection Parameter</b>", legal_style), Paragraph("<b>Certified Official Compliance Details</b>", legal_style)],
        [Paragraph("<b>Institution Name & Campus:</b>", legal_style), Paragraph("Bhartiya Institute of Technology & Science<br/>Campus Address: Khajuri Kalan, Huzur, Bhopal - 462022", legal_style)],
        [Paragraph("<b>Issuing Authority:</b>", legal_style), Paragraph("<b>Chief Fire Officer (CFO), Bhopal Municipal Corporation</b>", legal_style)],
        [Paragraph("<b>Building Occupancy Classification:</b>", legal_style), Paragraph("Group B - Educational Building (College Campus)", legal_style)],
        [Paragraph("<b>Maximum Building Height:</b>", legal_style), Paragraph("<b>14.50 Meters</b> (G+3 Floors Laboratory & Academic Wing)", legal_style)],
        [Paragraph("<b>Installed Fire Protection Systems:</b>", legal_style), Paragraph("Wet Riser System, Yard Hydrants, ABC Type Extinguishers, Automatic Smoke Detectors, 50,000L Underground Static Water Tank, 10,000L Terrace Tank, Diesel Booster Pump (2280 LPM).", legal_style)],
        [Paragraph("<b>Emergency Exit & Staircase Width:</b>", legal_style), Paragraph("Two separate fire-escape staircases, minimum width 2.0 meters each, unobstructed corridor clearance.", legal_style)],
        [Paragraph("<b>Certificate Validity Period:</b>", legal_style), Paragraph(f"Valid from 15-04-2025 until {validity_text}", legal_style)],
        [Paragraph("<b>Statutory NBC 2016 Compliance:</b>", legal_style), Paragraph(f"<b>{status_comment}</b>", legal_style)],
    ]

    t = Table(data, colWidths=[200, 310])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#FEF2F2")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#FECACA")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.extend([
        Spacer(1, 14),
        Paragraph("<b>STATUTORY CONDITIONS OF NOC:</b><br/>"
                  "1. All active fire fighting equipment must be maintained in operative condition at all times.<br/>"
                  "2. Mandatory mock fire drill and evacuation rehearsal must be executed every 6 months.<br/>"
                  "3. Any unauthorized structural alteration or vertical expansion without prior approval shall invalidate this certificate.<br/>"
                  "4. Application for renewal must be submitted 60 days prior to the expiration date.", legal_style),
        Spacer(1, 20),
    ])

    sig_data = [
        [
            Paragraph("<b>[OFFICIAL FIRE SERVICE SEAL]</b><br/>CHIEF FIRE OFFICER<br/>EMERGENCY SERVICES<br/>BHOPAL REGIONAL COMMAND", ParagraphStyle('FSeal', parent=legal_style, alignment=1, textColor=colors.HexColor("#8C2A1E"))),
            Paragraph("<b>Chief Fire Officer (CFO)</b><br/>Fire & Emergency Services<br/>Municipal Corporation Bhopal<br/>Official Clearance Code: <b>BPL-FIRE-SAFE-2027</b>", ParagraphStyle('FSig', parent=legal_style, alignment=1)),
        ]
    ]
    st = Table(sig_data, colWidths=[250, 260])
    st.setStyle(TableStyle([
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor("#8C2A1E")),
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#FFF1F2")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(st)

    doc.build(elements, onFirstPage=lambda c, d: draw_government_header(c, d, "FIRE SAFETY NOC"))
    print(f"Created: {pdf_path}")


def create_faculty_roster():
    pdf_path = OUTPUT_DIR / "04_Faculty_Roster_And_Salary_Statement.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=30,
        rightMargin=30,
        topMargin=30,
        bottomMargin=30,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'FacTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        alignment=1,
        textColor=colors.HexColor("#102D52"),
        spaceAfter=4,
    )
    legal_style = ParagraphStyle(
        'FacLegal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )

    elements = [
        Spacer(1, 8),
        Paragraph("BHARTIYA INSTITUTE OF TECHNOLOGY & SCIENCE", title_style),
        Paragraph("<b>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING & INFORMATION TECHNOLOGY</b>", ParagraphStyle('Dept', parent=title_style, fontSize=10, textColor=colors.HexColor("#8C2A1E"))),
        Paragraph("Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya | Approved by AICTE, New Delhi", ParagraphStyle('Aff', parent=legal_style, alignment=1, textColor=colors.HexColor("#64748B"))),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#102D52"), spaceBefore=4, spaceAfter=10),
        Paragraph("<b>STATUTORY REGULAR TEACHING FACULTY ROSTER & SALARY CERTIFICATION (ACADEMIC YEAR 2026-27)</b>", ParagraphStyle('RosterHead', parent=title_style, fontSize=9.5, textColor=colors.HexColor("#102D52"), spaceAfter=8)),
        Paragraph("<b>Summary Cadre Strength:</b> Total Faculty: <b>24</b> &nbsp;|&nbsp; Professors: <b>3</b> &nbsp;|&nbsp; Associate Professors: <b>6</b> &nbsp;|&nbsp; Assistant Professors: <b>15</b> &nbsp;|&nbsp; Ph.D. Holders: <b>11</b><br/>"
                  "<b>Student Intake:</b> 360 &nbsp;|&nbsp; <b>Student-Faculty Ratio (SFR):</b> <b>1:15</b> (Complies with AICTE 1:20 norm) &nbsp;|&nbsp; <b>Cadre Ratio:</b> <b>1:2:5</b> (Complies with 1:2:6 norm)", legal_style),
        Spacer(1, 8),
    ]

    # Sample Faculty Table
    faculty_rows = [
        ["#", "Faculty Full Name", "Designation", "Qualification", "PAN Number", "Pay Scale (7th CPC)", "Biometric ID"],
        ["1", "Dr. Arvind K. Saxena", "Professor & Head", "Ph.D. (IIT Roorkee)", "AAAPS4819M", "Level 14 (₹ 1,44,200)", "BIO-BPL-001"],
        ["2", "Dr. Meenakshi Sundaram", "Professor", "Ph.D. (IISc Bangalore)", "BCDPS9120K", "Level 14 (₹ 1,44,200)", "BIO-BPL-002"],
        ["3", "Dr. Rajeshwar N. Rao", "Professor", "Ph.D. (MANIT Bhopal)", "ABCPR1294F", "Level 14 (₹ 1,44,200)", "BIO-BPL-003"],
        ["4", "Dr. Sunita V. Deshmukh", "Associate Professor", "Ph.D. (BITS Pilani)", "AFKPD8192E", "Level 13A (₹ 1,31,400)", "BIO-BPL-004"],
        ["5", "Dr. Alok Nath Verma", "Associate Professor", "Ph.D. (IIT Delhi)", "BVNPA3412G", "Level 13A (₹ 1,31,400)", "BIO-BPL-005"],
        ["6", "Dr. Pradeep K. Chandel", "Associate Professor", "Ph.D. (RGPV Bhopal)", "ABWPC7819L", "Level 13A (₹ 1,31,400)", "BIO-BPL-006"],
        ["7", "Dr. Vandana S. Tiwari", "Associate Professor", "Ph.D. (DAVV Indore)", "ACCPT9102H", "Level 13A (₹ 1,31,400)", "BIO-BPL-007"],
        ["8", "Dr. Hemant R. Joshi", "Associate Professor", "Ph.D. (MNIT Jaipur)", "AMOPJ4512D", "Level 13A (₹ 1,31,400)", "BIO-BPL-008"],
        ["9", "Dr. Shilpa M. Patil", "Associate Professor", "Ph.D. (VNIT Nagpur)", "AQZPP6712B", "Level 13A (₹ 1,31,400)", "BIO-BPL-009"],
        ["10", "Prof. Vikram Aditya", "Assistant Professor", "M.Tech (IIT Bombay)", "ATUPA8912C", "Level 10 (₹ 57,700)", "BIO-BPL-010"],
        ["11", "Prof. Neha R. Bharadwaj", "Assistant Professor", "M.Tech (MANIT)", "AWQPB5614N", "Level 10 (₹ 57,700)", "BIO-BPL-011"],
        ["12", "Prof. Gaurav K. Mishra", "Assistant Professor", "M.Tech (RGPV)", "AXZPM2319P", "Level 10 (₹ 57,700)", "BIO-BPL-012"],
        ["13", "Prof. Deepa S. Nair", "Assistant Professor", "M.Tech (NIT Calicut)", "AYCPN7812R", "Level 10 (₹ 57,700)", "BIO-BPL-013"],
        ["14", "Prof. Rakesh B. Shinde", "Assistant Professor", "M.Tech (COEP Pune)", "AZBPS3419T", "Level 10 (₹ 57,700)", "BIO-BPL-014"],
    ]

    t_fac = Table(faculty_rows, colWidths=[20, 115, 85, 95, 75, 85, 60])
    t_fac.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#102D52")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    elements.append(t_fac)

    elements.extend([
        Spacer(1, 10),
        Paragraph("<b>PAY SCALE & BIOMETRIC VERIFICATION STATEMENT:</b><br/>"
                  "Certified that all the above 24 regular faculty members are paid salaries as per AICTE 7th CPC pay structure through "
                  "direct bank account transfer (NEFT/RTGS). Income tax TDS is deducted and Form 16 issued annually. Daily attendance is "
                  "recorded via Aadhaar-enabled biometric terminal (AEBAS). None of the faculty members are working full-time or part-time "
                  "in any other technical or educational institution.", legal_style),
        Spacer(1, 15),
    ])

    sig_data = [
        [
            Paragraph("<b>Chartered Accountant Endorsement</b><br/>M/s Sharma & Agarwal, CAs<br/>Membership No: 084192<br/>UDIN: 26084192AAAA0182", ParagraphStyle('CA', parent=legal_style, alignment=1)),
            Paragraph("<b>Principal / Director</b><br/>Bhartiya Institute of Technology & Science<br/>Bhopal, Madhya Pradesh<br/>College Seal Attached", ParagraphStyle('Princi', parent=legal_style, alignment=1)),
        ]
    ]
    st = Table(sig_data, colWidths=[265, 270])
    st.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor("#94A3B8")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(st)

    doc.build(elements, onFirstPage=lambda c, d: draw_government_header(c, d, "FACULTY ROSTER"))
    print(f"Created: {pdf_path}")


def create_building_plan():
    pdf_path = OUTPUT_DIR / "05_Master_Building_Plan_PWD_Safety.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'BldTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        alignment=1,
        textColor=colors.HexColor("#102D52"),
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        'BldSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        alignment=1,
        textColor=colors.HexColor("#0284C7"),
        spaceAfter=12,
    )
    legal_style = ParagraphStyle(
        'BldLegal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
    )

    elements = [
        Spacer(1, 10),
        Paragraph("MADHYA PRADESH PUBLIC WORKS DEPARTMENT (PWD)", title_style),
        Paragraph("OFFICE OF THE EXECUTIVE ENGINEER, CAPITAL DIVISION NO. 2, BHOPAL", sub_style),
        Paragraph("<b>CIVIL INFRASTRUCTURE & STRUCTURAL STABILITY APPRAISAL WING</b>", ParagraphStyle('BldWing', parent=sub_style, fontSize=9, textColor=colors.HexColor("#475569"))),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#102D52"), spaceBefore=4, spaceAfter=14),
        Paragraph("<b>STATUTORY BUILDING OCCUPANCY, BUILT-UP AREA & STRUCTURAL SAFETY ENDORSEMENT</b>", ParagraphStyle('BldHead', parent=title_style, fontSize=11, textColor=colors.HexColor("#102D52"), spaceAfter=12)),
        Paragraph("<b>Endorsement Order No:</b> PWD-BPL-STRUC-2024-8192 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Sanctioned Plan Ref:</b> BMC/TP/2021/4190", legal_style),
        Paragraph("<b>Date of Structural Audit:</b> 12th December 2024 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Validity:</b> Permanent Subject to Annual Maintenance", legal_style),
        Spacer(1, 10),
    ]

    data = [
        [Paragraph("<b>Statutory Built-up Area Parameter</b>", legal_style), Paragraph("<b>Certified Architecture Area (Sq. Meters)</b>", legal_style)],
        [Paragraph("<b>Institution Name:</b>", legal_style), Paragraph("Bhartiya Institute of Technology & Science, Bhopal", legal_style)],
        [Paragraph("<b>Approval Authority:</b>", legal_style), Paragraph("<b>Bhopal Municipal Corporation & PWD Executive Division</b>", legal_style)],
        [Paragraph("<b>Instructional Area:</b><br/>(Classrooms, Tutorial Rooms, Computer Labs, Workshops, Drawing Halls)", legal_style), Paragraph("<b>7,800.00 Sq. Meters</b><br/>(Exceeds minimum AICTE norm 5,400 sq.m)", legal_style)],
        [Paragraph("<b>Administrative Area:</b><br/>(Principal Office, Faculty Cabins, Board Room, Exam Control)", legal_style), Paragraph("<b>1,900.00 Sq. Meters</b><br/>(Exceeds minimum AICTE norm 1,200 sq.m)", legal_style)],
        [Paragraph("<b>Amenities & Common Facilities:</b><br/>(Library, Auditorium, Canteen, Rest Rooms, First Aid Clinic)", legal_style), Paragraph("<b>4,500.00 Sq. Meters</b>", legal_style)],
        [Paragraph("<b>Total Approved Built-Up Area:</b>", legal_style), Paragraph("<b>14,200.00 Sq. Meters</b> (Across 3 RCC Academic Blocks)", legal_style)],
        [Paragraph("<b>Earthquake & Structural Safety:</b>", legal_style), Paragraph("<b>Structural Safety Certified: YES</b><br/>Engineered for Seismic Zone-II compliance in accordance with IS 1893:2016.", legal_style)],
        [Paragraph("<b>Barrier-Free Access & Divyangjan:</b>", legal_style), Paragraph("Equipped with ramps, disabled-friendly lifts, and dedicated tactile walkways.", legal_style)],
    ]

    t = Table(data, colWidths=[200, 310])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F0F9FF")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#BAE6FD")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.extend([
        Spacer(1, 14),
        Paragraph("<b>ENGINEER STRUCTURAL CERTIFICATE:</b><br/>"
                  "This is to certify that the structural design and construction of the building blocks have been inspected and found "
                  "sound and safe for educational occupancy. The load bearing foundations and RCC framed super-structures are verified "
                  "under National Building Code specifications.", legal_style),
        Spacer(1, 25),
    ])

    sig_data = [
        [
            Paragraph("<b>[PWD SEAL & EMBOSS]</b><br/>EXECUTIVE ENGINEER<br/>PWD CAPITAL DIVISION<br/>BHOPAL, M.P.", ParagraphStyle('PSeal', parent=legal_style, alignment=1, textColor=colors.HexColor("#0284C7"))),
            Paragraph("<b>Executive Engineer (Civil)</b><br/>Public Works Department<br/>Bhopal, Madhya Pradesh<br/>License Reg No: <b>PWD-CIV-A-4190</b>", ParagraphStyle('PSig', parent=legal_style, alignment=1)),
        ]
    ]
    st = Table(sig_data, colWidths=[250, 260])
    st.setStyle(TableStyle([
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor("#0284C7")),
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#F0F9FF")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(st)

    doc.build(elements, onFirstPage=lambda c, d: draw_government_header(c, d, "BUILDING PLAN"))
    print(f"Created: {pdf_path}")


def create_affiliation_letter():
    pdf_path = OUTPUT_DIR / "06_University_Affiliation_Letter.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'UnivTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        alignment=1,
        textColor=colors.HexColor("#102D52"),
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        'UnivSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        alignment=1,
        textColor=colors.HexColor("#7C3AED"),
        spaceAfter=12,
    )
    legal_style = ParagraphStyle(
        'UnivLegal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
    )

    elements = [
        Spacer(1, 10),
        Paragraph("RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA", title_style),
        Paragraph("(STATE TECHNOLOGICAL UNIVERSITY OF MADHYA PRADESH)", sub_style),
        Paragraph("Airport Road, Gandhi Nagar, Bhopal, Madhya Pradesh - 462033", ParagraphStyle('UnivAddr', parent=legal_style, alignment=1, textColor=colors.HexColor("#64748B"))),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#102D52"), spaceBefore=4, spaceAfter=14),
        Paragraph("<b>NOTIFICATION: ANNUAL EXTENSION OF AFFILIATION ORDER FOR ACADEMIC SESSION 2026-27</b>", ParagraphStyle('OrderHead', parent=title_style, fontSize=10.5, textColor=colors.HexColor("#102D52"), spaceAfter=12)),
        Paragraph("<b>Order Dispatch No:</b> RGPV/ACAD-AFF/2026/8912 &nbsp;&nbsp;|&nbsp;&nbsp; <b>Dated:</b> 10th March 2026", legal_style),
        Spacer(1, 10),
    ]

    data = [
        [Paragraph("<b>Affiliation Record Item</b>", legal_style), Paragraph("<b>University Approved Particulars</b>", legal_style)],
        [Paragraph("<b>Affiliating University Name:</b>", legal_style), Paragraph("<b>Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)</b>", legal_style)],
        [Paragraph("<b>Affiliated Institution:</b>", legal_style), Paragraph("Bhartiya Institute of Technology & Science, Bhopal (College Code: 0142)", legal_style)],
        [Paragraph("<b>Academic Session Granted:</b>", legal_style), Paragraph("<b>2026-27</b> (Valid for One Academic Year)", legal_style)],
        [Paragraph("<b>Nature of Affiliation:</b>", legal_style), Paragraph("Provisional Extension of Affiliation", legal_style)],
        [Paragraph("<b>Sanctioned Degree Programs:</b>", legal_style), Paragraph("1. B.Tech Computer Science & Engineering (Intake: 120)<br/>2. B.Tech Electronics & Communication (Intake: 60)<br/>3. B.Tech Mechanical Engineering (Intake: 60)<br/>4. M.Tech Artificial Intelligence & Data Science (Intake: 18)", legal_style)],
        [Paragraph("<b>Total Sanctioned Intake Capacity:</b>", legal_style), Paragraph("<b>258 Seats</b>", legal_style)],
        [Paragraph("<b>Statutory Inspection Report:</b>", legal_style), Paragraph("Academic Inspection Committee visited on 18 Feb 2026; recommended extension.", legal_style)],
    ]

    t = Table(data, colWidths=[200, 310])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F5F3FF")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#DDD6FE")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    elements.extend([
        Spacer(1, 14),
        Paragraph("<b>TERMS OF AFFILIATION:</b><br/>"
                  "The college shall strictly abide by the regulations, ordinances, and admission guidelines prescribed by the University "
                  "and State Department of Technical Education. Any deficit in teaching faculty or laboratory infrastructure reported "
                  "during surprise inspection shall lead to withdrawal of university affiliation.", legal_style),
        Spacer(1, 25),
    ])

    sig_data = [
        [
            Paragraph("<b>[UNIVERSITY EMBOSSED SEAL]</b><br/>RGPV ACADEMIC COUNCIL<br/>BHOPAL, M.P.", ParagraphStyle('USeal', parent=legal_style, alignment=1, textColor=colors.HexColor("#7C3AED"))),
            Paragraph("<b>Registrar</b><br/>Rajiv Gandhi Proudyogiki Vishwavidyalaya<br/>Bhopal, Madhya Pradesh<br/>Order Verification: <b>RGPV-AFF-2026-AUTH</b>", ParagraphStyle('USig', parent=legal_style, alignment=1)),
        ]
    ]
    st = Table(sig_data, colWidths=[250, 260])
    st.setStyle(TableStyle([
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor("#7C3AED")),
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#F5F3FF")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(st)

    doc.build(elements, onFirstPage=lambda c, d: draw_government_header(c, d, "UNIVERSITY AFFILIATION"))
    print(f"Created: {pdf_path}")


def main():
    print("Generating official dummy dossiers in sample_documents/ ...")
    create_land_deed()
    create_fire_noc(tampered=False)
    create_fire_noc(tampered=True)
    create_faculty_roster()
    create_building_plan()
    create_affiliation_letter()
    print("All sample PDF dossiers successfully generated!")


if __name__ == "__main__":
    main()
