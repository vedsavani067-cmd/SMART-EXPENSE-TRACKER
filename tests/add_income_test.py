from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_add_income():
    print("Starting browser...")
    driver = webdriver.Chrome()
    
    try:
        # 1. Login Flow
        print("Navigating to login page...")
        driver.get("http://localhost:3000/login")
        driver.maximize_window()
        
        wait = WebDriverWait(driver, 10)
        
        email_field = wait.until(EC.presence_of_element_located((By.ID, "userEmail")))
        password_field = driver.find_element(By.ID, "userPass")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        
        # Assuming the same test user configuration is used
        print("Logging in as test@05gmail.com...")
        email_field.send_keys("test@05gmail.com")
        password_field.send_keys("Test@05")
        driver.execute_script("arguments[0].click();", submit_button)
        
        # Wait until dashboard loads
        wait.until(EC.url_contains("/dashboard"))
        print("Logged in successfully.")
        
        # 2. Add Income Flow
        print("Navigating to Add Income form...")
        driver.get("http://localhost:3000/add-income")
        
        # Wait for the number input (amount)
        amount_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='number']")))
        note_input = driver.find_element(By.CSS_SELECTOR, "input[type='text'][placeholder='Optional note...']")
        income_submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        
        print("Entering amount: 1500")
        amount_input.send_keys("1500")
        time.sleep(0.5)
        
        print("Entering note: Auto test income")
        note_input.send_keys("Auto test income")
        time.sleep(0.5)
        
        print("Submitting income form...")
        driver.execute_script("arguments[0].click();", income_submit_btn)
        
        # Wait for the readiness clearance inside AddIncome.jsx
        # Wait until amount returns to empty string.
        wait.until(lambda d: d.find_element(By.CSS_SELECTOR, "input[type='number']").get_attribute('value') == '')
        
        print("\n✅ TEST PASSED: Successfully added income and form was gracefully cleared for the next entry!")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        
    finally:
        time.sleep(3)
        print("Closing browser...")
        driver.quit()

if __name__ == "__main__":
    test_add_income()
