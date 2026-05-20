from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

def generate_random_email():
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser_{random_str}@gmail.com"

def test_register():
    print("Starting browser...")
    driver = webdriver.Chrome()
    
    try:
        print("Navigating to signup page...")
        driver.get("http://localhost:3000/signup")
        driver.maximize_window()
        
        wait = WebDriverWait(driver, 10)
        
        # Locate inputs
        name_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Your name']")))
        email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='e.g. Pass@123']")
        confirm_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Re-type password']")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        
        test_email = generate_random_email()
        test_password = "TestPassword@123"
        
        print(f"Registering new user: {test_email}")
        name_input.send_keys("Selenium Test User")
        email_input.send_keys(test_email)
        password_input.send_keys(test_password)
        confirm_input.send_keys(test_password)
        
        print("Submitting registration...")
        driver.execute_script("arguments[0].click();", submit_button)
        
        # Verify success by waiting for dashboard redirect
        wait.until(EC.url_contains("/dashboard"))
        print("\n✅ TEST PASSED: Successfully registered and redirected to the Dashboard!")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        
    finally:
        time.sleep(3)
        print("Closing browser...")
        driver.quit()

if __name__ == "__main__":
    test_register()
