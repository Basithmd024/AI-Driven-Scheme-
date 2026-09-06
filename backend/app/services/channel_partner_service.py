import math
from typing import List, Optional
from app.schemas.partner import ChannelPartnerBase, ChannelPartnerFilter, ChannelPartnerWithDistance

# Comprehensive directory of Channel Financing Partners across India with NPA & Fund-Utilization metrics
DATABASE_PARTNERS: List[ChannelPartnerBase] = [
    # Telangana
    ChannelPartnerBase(
        id="tsfcc-hyderabad",
        name="Telangana Scheduled Castes Co-op Finance Corp (TSFCC)",
        category="SCA",
        state="Telangana",
        district="Hyderabad",
        city="Hyderabad",
        address="DSS Bhavan, Masab Tank, Hyderabad, Telangana 500028",
        phone="+91 40 2339 1234",
        email="md.tsfcc@telangana.gov.in",
        contact_person="Dr. K. Ramesh (General Manager - Credit)",
        latitude=17.4028,
        longitude=78.4526,
        fund_utilization_rate=94.2,
        npa_rate=3.1,
        status="active",
        status_message="🟢 Active: Fast-track processing under 14 days. Full allocation available.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=14
    ),
    ChannelPartnerBase(
        id="sbi-koti-hyderabad",
        name="State Bank of India (Special SC/ST Lending Cell)",
        category="PSB",
        state="Telangana",
        district="Hyderabad",
        city="Hyderabad",
        address="Bank Street, Koti, Hyderabad, Telangana 500095",
        phone="+91 40 2475 8891",
        email="leadbank.hyderabad@sbi.co.in",
        contact_person="M. Surender (Lead District Officer)",
        latitude=17.3850,
        longitude=78.4867,
        fund_utilization_rate=88.5,
        npa_rate=4.2,
        status="active",
        status_message="🟢 Active: High quota for Education Loans & Term Loans.",
        supported_schemes=["term-loan-scheme", "education-loan-domestic", "education-loan-abroad"],
        avg_disbursement_days=18
    ),
    ChannelPartnerBase(
        id="tgb-warangal",
        name="Telangana Grameena Bank (RRB - Warangal Region)",
        category="RRB",
        state="Telangana",
        district="Warangal",
        city="Hanamkonda",
        address="Naimnagar Main Road, Warangal Urban, Telangana 506009",
        phone="+91 870 244 5512",
        email="tgb.warangal@telanganagrameenabank.org",
        contact_person="S. Venkataramana (Regional Head)",
        latitude=17.9689,
        longitude=79.5941,
        fund_utilization_rate=81.0,
        npa_rate=4.8,
        status="active",
        status_message="🟢 Active: Dedicated rural micro-finance network for artisans and small trades.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme"],
        avg_disbursement_days=20
    ),
    ChannelPartnerBase(
        id="spandana-mfi-hyderabad",
        name="Spandana Sphoorty Micro Finance (NBFC-MFI Channel)",
        category="NBFC-MFI",
        state="Telangana",
        district="Hyderabad",
        city="Secunderabad",
        address="MG Road, Rani Gunj, Secunderabad 500003",
        phone="+91 40 4567 8900",
        email="channel.partners@spandanaindia.com",
        contact_person="Pooja Reddy (Channel Manager)",
        latitude=17.4410,
        longitude=78.4980,
        fund_utilization_rate=91.0,
        npa_rate=3.8,
        status="active",
        status_message="🟢 Active: Express 7-day doorstep processing for Women SHGs.",
        supported_schemes=["micro-credit", "mahila-samriddhi"],
        avg_disbursement_days=7
    ),
    ChannelPartnerBase(
        id="deccan-grameena-nizamabad",
        name="Deccan Grameena Bank (Regional Rural Bank)",
        category="RRB",
        state="Telangana",
        district="Nizamabad",
        city="Nizamabad",
        address="Khaleelwadi, Nizamabad, Telangana 503001",
        phone="+91 8462 223 456",
        email="nizamabad@deccangrameena.bank",
        contact_person="R. Kishan",
        latitude=18.6725,
        longitude=78.0941,
        fund_utilization_rate=54.0,
        npa_rate=12.8,
        status="suspended",
        status_message="🔴 Routing Paused: Overdue/NPA rate (12.8%) exceeds safe limit. Redirected to SBI Nizamabad Main.",
        supported_schemes=["micro-credit", "term-loan-scheme"],
        avg_disbursement_days=45
    ),

    # Andhra Pradesh
    ChannelPartnerBase(
        id="apscc-vijayawada",
        name="AP Scheduled Castes Co-op Finance Corp (APSCC)",
        category="SCA",
        state="Andhra Pradesh",
        district="Krishna",
        city="Vijayawada",
        address="Collectorate Complex, Bandar Road, Vijayawada 520002",
        phone="+91 866 257 8890",
        email="vc_md@apscc.ap.gov.in",
        contact_person="B. Venkateswarlu (Executive Director)",
        latitude=16.5062,
        longitude=80.6480,
        fund_utilization_rate=93.0,
        npa_rate=3.5,
        status="active",
        status_message="🟢 Active: Complete digital routing integrated with Aadhaar Direct Benefit.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=15
    ),
    ChannelPartnerBase(
        id="canara-visakhapatnam",
        name="Canara Bank Circle Priority Cell (PSB)",
        category="PSB",
        state="Andhra Pradesh",
        district="Visakhapatnam",
        city="Visakhapatnam",
        address="Daba Gardens, Main Road, Visakhapatnam 530020",
        phone="+91 891 256 3411",
        email="cb.vizag@canarabank.com",
        contact_person="R. Muralidhar (AGM Priority Lending)",
        latitude=17.7231,
        longitude=83.3013,
        fund_utilization_rate=85.0,
        npa_rate=4.1,
        status="active",
        status_message="🟢 Active: Authorized nodal hub for Overseas & Domestic Higher Education loans.",
        supported_schemes=["term-loan-scheme", "education-loan-domestic", "education-loan-abroad"],
        avg_disbursement_days=16
    ),
    ChannelPartnerBase(
        id="apgvb-tirupati",
        name="Andhra Pragathi Grameena Bank (RRB)",
        category="RRB",
        state="Andhra Pradesh",
        district="Tirupati",
        city="Tirupati",
        address="Near RTC Bus Stand, Tirupati, Andhra Pradesh 517501",
        phone="+91 877 222 3444",
        email="tirupati.regional@apgb.co.in",
        contact_person="C. Prakash Rao",
        latitude=13.6288,
        longitude=79.4192,
        fund_utilization_rate=72.0,
        npa_rate=11.4,
        status="suspended",
        status_message="🔴 Routing Suspended: NPA threshold exceeded (11.4%). Applications re-routed to SBI Tirupati.",
        supported_schemes=["micro-credit", "mahila-samriddhi"],
        avg_disbursement_days=50
    ),

    # Maharashtra
    ChannelPartnerBase(
        id="mpbcdc-mumbai",
        name="Mahatma Phule Backward Classes Dev Corp (MPBCDC)",
        category="SCA",
        state="Maharashtra",
        district="Mumbai",
        city="Mumbai",
        address="Juhu Road, Santacruz West, Mumbai, Maharashtra 400054",
        phone="+91 22 2660 7891",
        email="ho@mpbcdc.gov.in",
        contact_person="Anil Kamble (Joint Director)",
        latitude=19.0825,
        longitude=72.8428,
        fund_utilization_rate=96.1,
        npa_rate=3.2,
        status="active",
        status_message="🟢 Active: High allocation quota for E-Vehicles, MSME Term Loans and Microfinance.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=12
    ),
    ChannelPartnerBase(
        id="mahabank-pune",
        name="Bank of Maharashtra (Zonal Specialized Microfinance)",
        category="PSB",
        state="Maharashtra",
        district="Pune",
        city="Pune",
        address="Lokmangal, 1501 Shivajinagar, Pune 411005",
        phone="+91 20 2553 2731",
        email="zmpune@mahabank.co.in",
        contact_person="Sunil Shinde (Lead Manager)",
        latitude=18.5314,
        longitude=73.8446,
        fund_utilization_rate=89.4,
        npa_rate=4.6,
        status="active",
        status_message="🟢 Active: Excellent support for Engineering/Medical professional student loans.",
        supported_schemes=["term-loan-scheme", "education-loan-domestic", "education-loan-abroad"],
        avg_disbursement_days=15
    ),

    # Delhi NCR
    ChannelPartnerBase(
        id="dsfdc-delhi",
        name="Delhi SC/ST/OBC/Minorities Development Corp (DSFDC)",
        category="SCA",
        state="Delhi",
        district="Central Delhi",
        city="New Delhi",
        address="Ambedkar Bhawan, Sector 16, Rohini, New Delhi 110085",
        phone="+91 11 2786 8920",
        email="cmd.dsfdc@delhi.gov.in",
        contact_person="Rajesh Kumar (Managing Director)",
        latitude=28.7180,
        longitude=77.1080,
        fund_utilization_rate=95.0,
        npa_rate=2.8,
        status="active",
        status_message="🟢 Active: 100% online verification with instant SCA endorsement.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=10
    ),
    ChannelPartnerBase(
        id="pnb-delhi",
        name="Punjab National Bank (Social Banking Corporate Wing)",
        category="PSB",
        state="Delhi",
        district="New Delhi",
        city="New Delhi",
        address="7 Bhikaji Cama Place & Sansad Marg, New Delhi 110001",
        phone="+91 11 2371 6185",
        email="prioritysector@pnb.co.in",
        contact_person="Amita Verma (DGM Priority Lending)",
        latitude=28.6219,
        longitude=77.2144,
        fund_utilization_rate=92.4,
        npa_rate=3.9,
        status="active",
        status_message="🟢 Active: Zero processing fee window for overseas SC education applicants.",
        supported_schemes=["term-loan-scheme", "education-loan-domestic", "education-loan-abroad"],
        avg_disbursement_days=14
    ),

    # Tamil Nadu
    ChannelPartnerBase(
        id="tahdco-chennai",
        name="Tamil Nadu Adi Dravidar Housing & Dev Corp (TAHDCO)",
        category="SCA",
        state="Tamil Nadu",
        district="Chennai",
        city="Chennai",
        address="TAHDCO Building, Cenotaph Road, Teynampet, Chennai 600018",
        phone="+91 44 2434 2205",
        email="tahdcoho@gmail.com",
        contact_person="S. Murugan (Special Officer)",
        latitude=13.0335,
        longitude=80.2458,
        fund_utilization_rate=97.5,
        npa_rate=2.5,
        status="active",
        status_message="🟢 Active: National top-performing SCA. Capital subsidies credited straight to bank.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=11
    ),

    # Karnataka
    ChannelPartnerBase(
        id="kscdc-bengaluru",
        name="Karnataka SC & ST Development Corp Ltd",
        category="SCA",
        state="Karnataka",
        district="Bengaluru Urban",
        city="Bengaluru",
        address="Dr. B.R. Ambedkar Bhavan, Millers Road, Vasanth Nagar, Bengaluru 560052",
        phone="+91 80 2286 4590",
        email="md.kscdc@karnataka.gov.in",
        contact_person="N. Shivanna (Deputy Director)",
        latitude=12.9912,
        longitude=77.5930,
        fund_utilization_rate=94.0,
        npa_rate=3.4,
        status="active",
        status_message="🟢 Active: Priority allocation for tech startups, transport, and micro credit.",
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "education-loan-domestic", "green-business-scheme"],
        avg_disbursement_days=13
    )
]


class ChannelPartnerService:
    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates geographic distance in kilometers between two GPS points."""
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 1)

    @classmethod
    def filter_and_route_partners(cls, filters: ChannelPartnerFilter) -> List[ChannelPartnerWithDistance]:
        results: List[ChannelPartnerWithDistance] = []

        for p in DATABASE_PARTNERS:
            # 1. State Filter
            if filters.state and filters.state.lower() != "all":
                if p.state.lower() != filters.state.lower():
                    continue

            # 2. District Filter
            if filters.district and filters.district.lower() != "all":
                if p.district.lower() != filters.district.lower():
                    continue

            # 3. Category Filter
            if filters.category and filters.category.lower() != "all":
                if p.category.lower() != filters.category.lower():
                    continue

            # 4. Scheme Support Filter
            if filters.scheme_id:
                if filters.scheme_id not in p.supported_schemes:
                    continue

            # 5. Active / Health Check (Filtering out high NPA / suspended branches)
            if filters.active_only and p.status != "active":
                continue

            # 6. Distance Calculation (if GPS coordinates provided)
            dist = None
            if filters.user_lat is not None and filters.user_lng is not None:
                dist = cls.calculate_haversine_distance(
                    filters.user_lat, filters.user_lng, p.latitude, p.longitude
                )
                if filters.max_distance_km and dist > filters.max_distance_km:
                    continue

            # Routing recommendation text
            if p.status == "active":
                rec = f"Recommended: Healthy fund utilization ({p.fund_utilization_rate}%) and low NPA ({p.npa_rate}%)."
            else:
                rec = f"Warning: Routing suspended due to high overdue/NPA ({p.npa_rate}%). Do not route application here."

            results.append(
                ChannelPartnerWithDistance(
                    **p.model_dump(),
                    distance_km=dist,
                    routing_recommendation=rec
                )
            )

        # Sort by distance if available, otherwise by fund utilization descending
        if filters.user_lat is not None and filters.user_lng is not None:
            results.sort(key=lambda x: (x.distance_km if x.distance_km is not None else 99999))
        else:
            results.sort(key=lambda x: x.fund_utilization_rate, reverse=True)

        return results
