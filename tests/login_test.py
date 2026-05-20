from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_login():
    # Setup Chrome WebDriver
    print("Starting browser...")
    driver = webdriver.Chrome()
    
    try:
        # Navigate to the Login Page
        print("Navigating to login page...")
        driver.get("http://localhost:3000/login")
        driver.maximize_window()
        
        # Wait for the email input field to load (id="userEmail")
        wait = WebDriverWait(driver, 10)
        email_field = wait.until(EC.presence_of_element_located((By.ID, "userEmail")))
        password_field = driver.find_element(By.ID, "userPass")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        
        # Action: Enter credentials
        test_email = "test@05gmail.com"
        test_password = "Test@05"
        
        print(f"Entering Email: {test_email}")
        email_field.send_keys(test_email)
        
        print("Entering Password...")
        password_field.send_keys(test_password)
        
        # Optional: Test the eye toggle!
        try:
            eye_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Show password']")
            eye_button.click()
            time.sleep(1) # Pause to visibly see the password is typed correctly
        except Exception as e:
            pass
            
        print("Clicking Submit...")
        driver.execute_script("arguments[0].click();", submit_button)
        
        # Verify Results: Wait to see if we get routed to the dashboard
        # Assuming the dashboard URL is http://localhost:5173/dashboard
        wait.until(EC.url_contains("/dashboard"))
        print("\n✅ TEST PASSED: Successfully logged in and redirected to the Dashboard!")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        
    finally:
        # Pause so you can see the result before closing
        time.sleep(3)
        print("Closing browser...")
        driver.quit()

if __name__ == "__main__":
    test_login()
