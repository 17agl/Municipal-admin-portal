import sqlite3
from datetime import datetime, timedelta
from database import get_connection, create_tables

create_tables()

conn = get_connection()
cursor = conn.cursor()

# Check if complaints table is empty
cursor.execute("SELECT COUNT(*) FROM municipal_complaints")
if cursor.fetchone()[0] == 0:
    print("Seeding initial municipal complaints...")
    complaints = [
        (
            "CMP-2026-1042", "Rohan Sharma", "+91 98765 43210", "rohan.sharma@gmail.com",
            "Old Market Backlane Corner", "Ward 1 - Central Market & Bazaar",
            "Behind Sabzi Mandi Gate 2, Main Bazaar Road", 28.6229, 77.2010,
            "Plastic & Mixed Packaging", 94.8,
            "Dense pile of single-use LDPE bags, pet bottles, and commercial shipping bubble wrap.",
            "High", "P1 - Immediate", "In-Progress",
            datetime.utcnow().isoformat(), (datetime.utcnow() + timedelta(hours=4)).isoformat(),
            "STF-101", "Sunil Verma", 18,
            "Garbage is piling up near food stalls. Strong odor.",
            "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
            "Compactor truck dispatched at 09:30 AM. Clearance 60% complete."
        ),
        (
            "CMP-2026-1043", "Dr. Ananya Sen", "+91 98111 22334", "ananya.sen@clinic.org",
            "Railway Underpass East", "Ward 3 - Industrial & Logistics Area",
            "Underpass Pillar 14B, Near Freight Yard Terminal", 28.6360, 77.1980,
            "Construction & E-Waste Scrap", 91.2,
            "Detected crushed CRT glass, discarded circuit PCBs, copper wiring scraps.",
            "Critical", "P1 - Immediate", "Pending",
            datetime.utcnow().isoformat(), (datetime.utcnow() + timedelta(hours=6)).isoformat(),
            None, None, 15,
            "Broken monitor glass and hazardous chemical residue dumped overnight under bridge.",
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
            None
        ),
        (
            "CMP-2026-1039", "Vikas Malhotra", "+91 98442 88990", "v.malhotra@residence.in",
            "Sector 4 Bus Stand Drain", "Ward 1 - Central Market & Bazaar",
            "Opposite Bus Shelter 4A, Ring Road Junction", 28.6190, 77.2180,
            "Plastic Bottles & Cans", 89.5,
            "Beverage tin cans, crushed PET bottles, and aluminium drink lids blocking storm water grate.",
            "Medium", "P2 - High", "In-Progress",
            datetime.utcnow().isoformat(), (datetime.utcnow() + timedelta(hours=12)).isoformat(),
            "STF-102", "Deepak Mehra", 11,
            "Municipal dustbin was damaged last week; now trash is overflowing directly into the open drain.",
            "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80",
            "Team on site. Grating cleared. Replacing with twin 240L bins."
        ),
        (
            "CMP-2026-1035", "Pooja Trivedi", "+91 98771 33445", "pooja.trivedi@outlook.com",
            "Green Park Gate 3 Footpath", "Ward 2 - Green Park & Enclave",
            "Pedestrian Walkway along Public Park Boundary Wall", 28.6080, 77.2120,
            "Organic & Food Waste", 96.1,
            "Compostable sugarcane bagasse bowls, food scraps, and vegetable peels.",
            "Low", "P3 - Standard", "Resolved",
            (datetime.utcnow() - timedelta(days=1)).isoformat(), datetime.utcnow().isoformat(),
            "STF-104", "Kavita Chawla", 6,
            "Street food vendors left heaps of paper plates and spoiled fruits.",
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            "Cleaned by sanitation sweepers. 250 kg organic waste diverted to Bio-Composter."
        )
    ]

    cursor.executemany("""
        INSERT INTO municipal_complaints (
            id, citizen_name, citizen_phone, citizen_email, area_name, ward, address,
            lat, lng, ai_category, ai_confidence, ai_reasoning, severity, priority,
            status, created_at, deadline, assigned_to, assigned_staff_name,
            reports_count, citizen_notes, image_url, resolution_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, complaints)

# Check Staff
cursor.execute("SELECT COUNT(*) FROM municipal_staff")
if cursor.fetchone()[0] == 0:
    print("Seeding initial municipal staff...")
    staff = [
        ("STF-101", "Sunil Verma", "Rapid Response Driver", "Heavy Vehicle Operator", "Zone 1 Quick Clean", "Ward 1 - Central Market & Bazaar", "+91 98112 34567", "s.verma@municipal.ecosort.gov.in", "Active", "Morning (06:00 - 14:00)", "DL-1GB-4091 (Compactor)", 2, 4.8),
        ("STF-102", "Deepak Mehra", "Sanitation Supervisor", "Field Inspector", "Enforcement & Compliance", "Ward 1 - Central Market & Bazaar", "+91 98223 45678", "d.mehra@municipal.ecosort.gov.in", "Active", "Morning (07:00 - 15:00)", "DL-1GP-2019 (Inspection Patrol)", 1, 4.9),
        ("STF-103", "Aman Preet Singh", "E-Waste Specialist", "Senior Field Tech", "Special Category Cleaners", "Ward 3 - Industrial & Logistics Area", "+91 98334 56789", "aman.singh@municipal.ecosort.gov.in", "Active", "General (09:00 - 17:00)", "DL-1GB-8812 (Hazardous Safe-Van)", 3, 4.7),
        ("STF-104", "Kavita Chawla", "Area Health Officer", "Sanitary Inspector", "Public Hygiene Unit", "Ward 2 - Green Park & Enclave", "+91 98445 67890", "k.chawla@municipal.ecosort.gov.in", "Active", "Morning (06:00 - 14:00)", "DL-1GP-1102 (Patrol)", 1, 4.95)
    ]
    cursor.executemany("""
        INSERT INTO municipal_staff (
            id, name, role, designation, team, ward, phone, email, status, shift,
            vehicle_assigned, active_tasks, rating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, staff)

# Check Smart Bins
cursor.execute("SELECT COUNT(*) FROM municipal_smart_bins")
if cursor.fetchone()[0] == 0:
    print("Seeding initial municipal smart bins...")
    bins = [
        ("BIN-101", "SB-CM-01", "Main Bazaar West Gate", "Ward 1 - Central Market & Bazaar", 28.6254, 77.2132, 94, "Dry Recyclable Waste", "Overflow Alert", 82, 28.4, 1100, "Yesterday, 18:30"),
        ("BIN-102", "SB-CM-02", "Vegetable Wholesale Alley", "Ward 1 - Central Market & Bazaar", 28.6221, 77.2175, 88, "Wet Organic Compostable", "Overflow Alert", 76, 32.1, 1100, "Today, 06:15"),
        ("BIN-103", "SB-GP-01", "Community Center Park", "Ward 2 - Green Park & Enclave", 28.6082, 77.2064, 42, "Mixed Dry Waste", "Normal", 95, 24.0, 660, "Today, 07:45"),
        ("BIN-105", "SB-IND-01", "Logistics Hub Loading Bay 3", "Ward 3 - Industrial & Logistics Area", 28.6425, 77.1942, 96, "Industrial Scrap / Non-Hazardous", "Overflow Alert", 68, 30.5, 2400, "2 days ago")
    ]
    cursor.executemany("""
        INSERT INTO municipal_smart_bins (
            id, code, location, ward, lat, lng, fill_level, category, status,
            battery_level, temperature_c, capacity_liters, last_emptied
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, bins)

# Check Collections
cursor.execute("SELECT COUNT(*) FROM municipal_collections")
if cursor.fetchone()[0] == 0:
    print("Seeding initial weighbridge records...")
    cols = [
        ("COL-901", "WT-2026-8819", "2026-11-16", "07:30 AM", "DL-1GB-4091", "Compactor Truck (12T)", "Sunil Verma", "Ward 1 - Central Market & Bazaar", "Dry Mixed Recyclables", 14850.0, 8200.0, 6650.0, "Okhla MRF Facility", "Disposed & Verified"),
        ("COL-902", "WT-2026-8820", "2026-11-16", "08:15 AM", "DL-1GB-7744", "Hydraulic Tipper (8T)", "Rajesh Paswan", "Ward 5 - Riverfront & Old City", "Floral & Organic Scraps", 9800.0, 5400.0, 4400.0, "Ward 5 Composting Park", "Disposed & Verified")
    ]
    cursor.executemany("""
        INSERT INTO municipal_collections (
            id, ticket_no, date, time, vehicle_number, vehicle_type, driver_name,
            ward, waste_category, gross_weight_kg, tare_weight_kg, net_waste_kg,
            destination_facility, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, cols)

conn.commit()
conn.close()
print("Database seed complete!")
