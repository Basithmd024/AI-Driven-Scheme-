import math
from typing import List, Optional
from app.schemas.partner import ChannelPartnerBase, ChannelPartnerFilter, ChannelPartnerWithDistance

# Comprehensive Nationwide Directory of Channel Financing Partners across India with NPA & Fund-Utilization metrics
DATABASE_PARTNERS: List[ChannelPartnerBase] = [
    # ─── North Zone ───
    ChannelPartnerBase(
        id="del-sbi-cp",
        name="State Bank of India — SME Parliament Street Branch",
        category="PSB",
        state="Delhi",
        district="New Delhi",
        city="New Delhi",
        address="11, Parliament Street, Connaught Place, New Delhi 110001",
        phone="+91 11 2374 1234",
        email="sme.delhi@sbi.co.in",
        contact_person="R. K. Malhotra (Chief Manager - SME Credit)",
        latitude=28.6289,
        longitude=77.2155,
        fund_utilization_rate=96.5,
        npa_rate=2.4,
        status="active",
        status_message="🟢 Active: High quota for PMEGP, Stand-Up India, and Mudra loans.",
        supported_schemes=["pmegp", "mudra", "standup-india", "cgtmse"],
        avg_disbursement_days=10
    ),
    ChannelPartnerBase(
        id="del-sc-st-corp",
        name="Delhi SC/ST/OBC/Minorities Financial Corp (DSFDC)",
        category="SCA",
        state="Delhi",
        district="Central Delhi",
        city="New Delhi",
        address="Ambedkar Bhawan, Sector-16, Rohini, New Delhi 110085",
        phone="+91 11 2786 8920",
        email="md.dsfdc@delhi.gov.in",
        contact_person="Sunita Meena (Executive Director)",
        latitude=28.7320,
        longitude=77.1180,
        fund_utilization_rate=91.0,
        npa_rate=3.8,
        status="active",
        status_message="🟢 Active: Direct state channel partner for NSFDC, NBCFDC & NMDFC schemes.",
        supported_schemes=["nsfdc-msy", "nsfdc-mcs", "nbcfdc-swarnima", "nmdfc-virasat"],
        avg_disbursement_days=15
    ),
    ChannelPartnerBase(
        id="up-sc-lucknow",
        name="UP Scheduled Castes Finance & Development Corp (UPSCFDC)",
        category="SCA",
        state="Uttar Pradesh",
        district="Lucknow",
        city="Lucknow",
        address="Bapu Bhawan, Vidhan Sabha Marg, Lucknow, Uttar Pradesh 226001",
        phone="+91 522 223 8910",
        email="md.upscfdc@up.gov.in",
        contact_person="Anil Kumar Yadav (Managing Director)",
        latitude=26.8467,
        longitude=80.9462,
        fund_utilization_rate=93.4,
        npa_rate=4.1,
        status="active",
        status_message="🟢 Active: State-wide network for PM Vishwakarma and MSY concessional finance.",
        supported_schemes=["pm-vishwakarma", "nsfdc-msy", "pmegp", "term-loan"],
        avg_disbursement_days=16
    ),
    ChannelPartnerBase(
        id="up-baroda-rrb",
        name="Baroda UP Bank (RRB — Gorakhpur Head Office)",
        category="RRB",
        state="Uttar Pradesh",
        district="Gorakhpur",
        city="Gorakhpur",
        address="Buddh Vihar Commercial Complex, Taramandal, Gorakhpur 273016",
        phone="+91 551 220 1200",
        email="credit.rural@barodaupbank.co.in",
        contact_person="Manoj Tripathi (General Manager)",
        latitude=26.7606,
        longitude=83.3732,
        fund_utilization_rate=87.2,
        npa_rate=3.5,
        status="active",
        status_message="🟢 Active: Premier rural credit network across 31 districts of Eastern UP.",
        supported_schemes=["mudra", "pmegp", "pm-svanidhi", "micro-credit"],
        avg_disbursement_days=12
    ),

    # ─── West Zone ───
    ChannelPartnerBase(
        id="mah-mpbcdc-mumbai",
        name="Mahatma Phule Backward Class Development Corp (MPBCDC)",
        category="SCA",
        state="Maharashtra",
        district="Mumbai City",
        city="Mumbai",
        address="Juhu Supreme Shopping Centre, Gulmohar Cross Rd, JVPD, Mumbai 400049",
        phone="+91 22 2620 4455",
        email="mpbcdc.mumbai@maharashtra.gov.in",
        contact_person="P. S. Kamble (Managing Director)",
        latitude=19.1075,
        longitude=72.8263,
        fund_utilization_rate=92.8,
        npa_rate=3.9,
        status="active",
        status_message="🟢 Active: Apex SCA for SC/OBC concessional finance in Maharashtra.",
        supported_schemes=["nsfdc-msy", "nbcfdc-swarnima", "pm-vishwakarma", "term-loan"],
        avg_disbursement_days=14
    ),
    ChannelPartnerBase(
        id="mah-bom-pune",
        name="Bank of Maharashtra (MSME Hub Pune)",
        category="PSB",
        state="Maharashtra",
        district="Pune",
        city="Pune",
        address="Lokmangal, 1501 Shivajinagar, Pune, Maharashtra 411005",
        phone="+91 20 2553 2731",
        email="msme.pune@mahabank.co.in",
        contact_person="Vandana Joshi (DGM - Priority Sector)",
        latitude=18.5314,
        longitude=73.8446,
        fund_utilization_rate=95.1,
        npa_rate=2.8,
        status="active",
        status_message="🟢 Active: Fast-track digital sanction for PMEGP and Stand-Up India.",
        supported_schemes=["pmegp", "standup-india", "mudra", "cgtmse"],
        avg_disbursement_days=9
    ),
    ChannelPartnerBase(
        id="guj-bob-ahmedabad",
        name="Bank of Baroda — Lead District Office",
        category="PSB",
        state="Gujarat",
        district="Ahmedabad",
        city="Ahmedabad",
        address="Baroda Bhavan, Near Parimal Garden, Ellisbridge, Ahmedabad 380006",
        phone="+91 79 2658 9000",
        email="leadbank.ahmedabad@bankofbaroda.co.in",
        contact_person="Nitin Patel (Chief Manager)",
        latitude=23.0189,
        longitude=72.5574,
        fund_utilization_rate=94.0,
        npa_rate=2.2,
        status="active",
        status_message="🟢 Active: Leading channel for MSME & Diamond/Textile artisan finance.",
        supported_schemes=["pm-vishwakarma", "pmegp", "mudra", "cgtmse"],
        avg_disbursement_days=11
    ),

    # ─── South Zone ───
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
        supported_schemes=["term-loan-scheme", "education-loan-domestic", "education-loan-abroad", "pmegp"],
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
        supported_schemes=["micro-credit", "mahila-samriddhi", "term-loan-scheme", "pm-vishwakarma"],
        avg_disbursement_days=20
    ),
    ChannelPartnerBase(
        id="ap-apscc-vijayawada",
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
        supported_schemes=["micro-credit", "mahila-samriddhi", "pmegp", "green-business"],
        avg_disbursement_days=15
    ),
    ChannelPartnerBase(
        id="kar-ambedkar-bengaluru",
        name="Dr. B.R. Ambedkar Development Corp Karnataka",
        category="SCA",
        state="Karnataka",
        district="Bengaluru Urban",
        city="Bengaluru",
        address="9th Floor, Visvesvaraya Mini Tower, Dr. Ambedkar Veedhi, Bengaluru 560001",
        phone="+91 80 2286 1420",
        email="md.adcl@karnataka.gov.in",
        contact_person="K. Shivaram (Managing Director)",
        latitude=12.9784,
        longitude=77.5925,
        fund_utilization_rate=95.0,
        npa_rate=2.9,
        status="active",
        status_message="🟢 Active: Priority allocation for tech enterprises, solar units, and self-employment.",
        supported_schemes=["nsfdc-msy", "pmegp", "standup-india", "pm-vishwakarma"],
        avg_disbursement_days=12
    ),
    ChannelPartnerBase(
        id="tn-tahdco-chennai",
        name="Tamil Nadu Adi Dravidar Housing & Development Corp (TAHDCO)",
        category="SCA",
        state="Tamil Nadu",
        district="Chennai",
        city="Chennai",
        address="No. 31, Cenotaph Road, Teynampet, Chennai, Tamil Nadu 600018",
        phone="+91 44 2434 2224",
        email="tahdco@tn.gov.in",
        contact_person="Dr. M. Sangeetha (Managing Director)",
        latitude=13.0298,
        longitude=80.2450,
        fund_utilization_rate=96.0,
        npa_rate=2.5,
        status="active",
        status_message="🟢 Active: Direct subsidy coordination for women self-help groups & artisans.",
        supported_schemes=["nsfdc-msy", "pmegp", "pm-vishwakarma", "mudra"],
        avg_disbursement_days=10
    ),

    # ─── East & Central Zone ───
    ChannelPartnerBase(
        id="wb-scst-kolkata",
        name="West Bengal SC/ST Development & Finance Corp",
        category="SCA",
        state="West Bengal",
        district="Kolkata",
        city="Kolkata",
        address="CF-217/A/1, Sector-I, Salt Lake City, Kolkata, West Bengal 700064",
        phone="+91 33 2359 5555",
        email="wbscstdfc@gmail.com",
        contact_person="Tapan Kumar Roy (Managing Director)",
        latitude=22.5855,
        longitude=88.4120,
        fund_utilization_rate=89.5,
        npa_rate=4.0,
        status="active",
        status_message="🟢 Active: Extensive reach across handloom weaving and leather clusters.",
        supported_schemes=["pm-vishwakarma", "pmegp", "mudra", "nmdfc-virasat"],
        avg_disbursement_days=17
    ),
    ChannelPartnerBase(
        id="bih-sc-patna",
        name="Bihar State SC/ST Co-operative Development Corp",
        category="SCA",
        state="Bihar",
        district="Patna",
        city="Patna",
        address="Vikas Bhawan, Bailey Road, Patna, Bihar 800015",
        phone="+91 612 221 5430",
        email="scstcorp.bihar@gov.in",
        contact_person="Rameshwar Singh (CEO)",
        latitude=25.6093,
        longitude=85.1235,
        fund_utilization_rate=88.0,
        npa_rate=4.5,
        status="active",
        status_message="🟢 Active: Rural micro-credit and Mudra forwarding center.",
        supported_schemes=["mudra", "pm-svanidhi", "pmegp", "nsfdc-msy"],
        avg_disbursement_days=18
    ),
    ChannelPartnerBase(
        id="mp-antyavasayi-bhopal",
        name="MP Antyavasayi Sahakari Vikas Nigam",
        category="SCA",
        state="Madhya Pradesh",
        district="Bhopal",
        city="Bhopal",
        address="Rajiv Gandhi Bhawan, 35 Shyamla Hills, Bhopal, Madhya Pradesh 462002",
        phone="+91 755 266 0123",
        email="mpantyavasayi@mp.gov.in",
        contact_person="Girish Sharma (Managing Director)",
        latitude=23.2425,
        longitude=77.3910,
        fund_utilization_rate=91.5,
        npa_rate=3.6,
        status="active",
        status_message="🟢 Active: Major hub for Tribal (NSTFDC) and SC (NSFDC) channel finance.",
        supported_schemes=["nstfdc-amsy", "nsfdc-msy", "pm-vishwakarma", "pmegp"],
        avg_disbursement_days=14
    ),
    ChannelPartnerBase(
        id="raj-scst-jaipur",
        name="Rajasthan SC/ST Finance & Development Co-op Corp (Anuprati)",
        category="SCA",
        state="Rajasthan",
        district="Jaipur",
        city="Jaipur",
        address="Nehru Sahakar Bhawan, Bhawani Singh Road, Jaipur, Rajasthan 302001",
        phone="+91 141 274 0890",
        email="md.rajscst@rajasthan.gov.in",
        contact_person="Pooja Meena (Managing Director)",
        latitude=26.8920,
        longitude=75.8050,
        fund_utilization_rate=92.0,
        npa_rate=3.2,
        status="active",
        status_message="🟢 Active: Handicraft, solar, and tourism micro-enterprise support.",
        supported_schemes=["pm-vishwakarma", "pmegp", "standup-india", "mudra"],
        avg_disbursement_days=13
    ),

    # ─── North-East Zone ───
    ChannelPartnerBase(
        id="ne-assam-guwahati",
        name="Assam Plains Tribes Development Corp & Lead Bank PNB",
        category="SCA",
        state="Assam",
        district="Kamrup Metropolitan",
        city="Guwahati",
        address="Ganeshguri Chariali, Dispur, Guwahati, Assam 781006",
        phone="+91 361 223 4567",
        email="aptc.assam@gov.in",
        contact_person="B. K. Bodo (Managing Director)",
        latitude=26.1445,
        longitude=91.7898,
        fund_utilization_rate=90.0,
        npa_rate=3.8,
        status="active",
        status_message="🟢 Active: Special 35% PMEGP subsidy zone & Tribal AMSY concessional credit.",
        supported_schemes=["pmegp", "nstfdc-amsy", "pm-vishwakarma", "mudra"],
        avg_disbursement_days=15
    )
]


class ChannelPartnerService:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance between two GPS coordinates in kilometers."""
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @classmethod
    def filter_and_route_partners(cls, filters: ChannelPartnerFilter) -> List[ChannelPartnerWithDistance]:
        results = []

        for p in DATABASE_PARTNERS:
            # State filter
            if filters.state and filters.state != "All":
                if p.state.lower() != filters.state.lower():
                    continue

            # Category filter (SCA, PSB, RRB, NBFC-MFI)
            if filters.category and filters.category != "All":
                if p.category != filters.category:
                    continue

            # Active-only filter (NPA < 5% / not suspended)
            if filters.active_only:
                if p.status != "active" or p.npa_rate > 5.0:
                    continue

            distance = None
            if filters.user_lat is not None and filters.user_lng is not None:
                distance = cls.haversine_distance(
                    filters.user_lat, filters.user_lng,
                    p.latitude, p.longitude
                )

            # Routing recommendations
            if p.npa_rate > 5.0:
                routing_note = f"⚠️ High NPA warning ({p.npa_rate}%). Routing to alternate branch recommended."
            elif p.fund_utilization_rate >= 90.0:
                routing_note = f"🟢 High Priority Partner: {p.fund_utilization_rate}% allocation deployed with {p.avg_disbursement_days}d TAT."
            else:
                routing_note = f"🔵 Standard Channel Partner: Average processing time {p.avg_disbursement_days} days."

            results.append(ChannelPartnerWithDistance(
                **p.dict(),
                distance_km=distance,
                routing_recommendation=routing_note
            ))

        # Sort by distance if GPS coordinates provided, otherwise by fund utilization
        if filters.user_lat is not None and filters.user_lng is not None:
            results.sort(key=lambda x: (x.distance_km if x.distance_km is not None else 99999))
        else:
            results.sort(key=lambda x: x.fund_utilization_rate, reverse=True)

        return results
