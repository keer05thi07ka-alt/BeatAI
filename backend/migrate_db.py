import sqlite3

def migrate():
    try:
        conn = sqlite3.connect("beat.db")
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE reports ADD COLUMN user_email TEXT DEFAULT 'demo@beat.health'")
        conn.commit()
        print("Successfully added user_email column to beat.db!")
    except Exception as e:
        print("Migration note:", e)

if __name__ == "__main__":
    migrate()
