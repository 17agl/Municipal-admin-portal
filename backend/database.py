import sqlite3
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "municipal.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()
    cursor = connection.cursor()

    # Complaints Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS municipal_complaints (
            id TEXT PRIMARY KEY,
            citizen_name TEXT,
            citizen_phone TEXT,
            citizen_email TEXT,
            area_name TEXT NOT NULL,
            ward TEXT NOT NULL,
            address TEXT,
            lat REAL,
            lng REAL,
            ai_category TEXT,
            ai_confidence REAL,
            ai_reasoning TEXT,
            severity TEXT,
            priority TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TEXT NOT NULL,
            deadline TEXT,
            assigned_to TEXT,
            assigned_staff_name TEXT,
            reports_count INTEGER DEFAULT 1,
            citizen_notes TEXT,
            image_url TEXT,
            resolution_notes TEXT
        )
    """)

    # Staff Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS municipal_staff (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT,
            designation TEXT,
            team TEXT,
            ward TEXT,
            phone TEXT,
            email TEXT,
            status TEXT DEFAULT 'Active',
            shift TEXT,
            vehicle_assigned TEXT,
            active_tasks INTEGER DEFAULT 0,
            rating REAL DEFAULT 5.0
        )
    """)

    # Smart Bins Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS municipal_smart_bins (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            location TEXT NOT NULL,
            ward TEXT NOT NULL,
            lat REAL,
            lng REAL,
            fill_level INTEGER DEFAULT 0,
            category TEXT,
            status TEXT DEFAULT 'Normal',
            battery_level INTEGER DEFAULT 100,
            temperature_c REAL DEFAULT 25.0,
            capacity_liters INTEGER DEFAULT 1100,
            last_emptied TEXT
        )
    """)

    # Weighbridge Collection Records Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS municipal_collections (
            id TEXT PRIMARY KEY,
            ticket_no TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            vehicle_number TEXT NOT NULL,
            vehicle_type TEXT,
            driver_name TEXT,
            ward TEXT,
            waste_category TEXT,
            gross_weight_kg REAL,
            tare_weight_kg REAL,
            net_waste_kg REAL,
            destination_facility TEXT,
            status TEXT DEFAULT 'Disposed & Verified'
        )
    """)

    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_tables()
    print("Municipal database tables initialized at:", DATABASE_PATH)
