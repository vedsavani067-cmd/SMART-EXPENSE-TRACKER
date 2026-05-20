const { Builder, By, until } = require('selenium-webdriver');

async function testRegister() {
  console.log("Starting browser...");
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("Navigating to signup page...");
    await driver.get('http://localhost:3000/signup');
    await driver.manage().window().maximize();

    const nameInput = await driver.wait(until.elementLocated(By.css("input[placeholder='Your name']")), 10000);
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    const passwordInput = await driver.findElement(By.css("input[placeholder='e.g. Pass@123']"));
    const confirmInput = await driver.findElement(By.css("input[placeholder='Re-type password']"));
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    const randomStr = Math.random().toString(36).substring(2, 10);
    const testEmail = `testuser_${randomStr}@gmail.com`;
    const testPassword = "TestPassword@123";

    console.log(`Registering new user: ${testEmail}`);
    await nameInput.sendKeys("Selenium Test User JS");
    await emailInput.sendKeys(testEmail);
    await passwordInput.sendKeys(testPassword);
    await confirmInput.sendKeys(testPassword);

    console.log("Submitting registration...");
    await driver.executeScript("arguments[0].click();", submitBtn);

    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log("\n✅ TEST PASSED: Successfully registered and redirected to the Dashboard!");

  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
  } finally {
    await driver.sleep(3000);
    console.log("Closing browser...");
    await driver.quit();
  }
}

testRegister();
