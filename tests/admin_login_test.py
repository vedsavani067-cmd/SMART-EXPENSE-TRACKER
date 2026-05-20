from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_admin_login():
    print("Starting browser...")
    driver = webdriver.Chrome()
    
    try:
        # Navigate to Admin Login Page
        print("Navigating to admin login page...")
        driver.get("http://localhost:3000/admin-login")
        driver.maximize_window()
        
        wait = WebDriverWait(driver, 10)
        
        email_field = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
        password_field = driver.find_element(By.CSS_SELECTOR, "input[placeholder='••••••••']")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        
        # Test Credentials
        test_email = "admin@expense.com"
        test_password = "adminPass99"
        
        print(f"Entering Admin Email: {test_email}")
        email_field.send_keys(test_email)
        
        print("Entering Admin Security Key...")
        password_field.send_keys(test_password)
        
        print("Clicking Access Dashboard...")
        driver.execute_script("arguments[0].click();", submit_button)
        
        # Verify Results: Wait to see if we get routed to the admin dashboard
        wait.until(EC.url_contains("/admin"))
        print("\n✅ TEST PASSED: Successfully logged in as admin and redirected to the Admin Dashboard!")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        
    finally:
        time.sleep(3)
        print("Closing browser...")
        driver.quit()

if __name__ == "__main__":
    test_admin_login()
