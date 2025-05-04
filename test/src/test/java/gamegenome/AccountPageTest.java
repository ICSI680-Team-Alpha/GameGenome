package gamegenome;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import io.github.bonigarcia.wdm.WebDriverManager;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AccountPageTest {

    private WebDriver driver;

    @Before
    public void setUp() {
        // WebDriverManager will automatically download and configure the driver
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.get("http://localhost:5173/account");
    }

    @Test
    public void testAccountPageElements() {
        // Verify the logo is displayed
        WebElement logo = driver.findElement(By.cssSelector(".headerLogo img"));
        assertTrue("Logo is not displayed", logo.isDisplayed());

        // Verify header buttons
        WebElement accountButton = driver.findElement(By.className("accBtn"));
        assertTrue("Account button is not displayed", accountButton.isDisplayed());
        assertTrue("Account button text is incorrect", accountButton.getText().contains("Account"));

        WebElement logoutButton = driver.findElement(By.className("logBtn"));
        assertTrue("Logout button is not displayed", logoutButton.isDisplayed());
        assertTrue("Logout button text is incorrect", logoutButton.getText().contains("Logout"));

        // Verify account settings title
        WebElement settingsTitle = driver.findElement(
                By.xpath("//div[contains(@class, 'main-content')]//h6"));
        assertTrue("Account Settings title is not displayed", settingsTitle.isDisplayed());
        assertEquals("Account Settings", settingsTitle.getText());

        // Verify option buttons
        WebElement profileButton = driver.findElement(
                By.xpath("//button[contains(text(), 'Profile')]"));
        assertTrue("Profile button is not displayed", profileButton.isDisplayed());

        WebElement passwordButton = driver.findElement(
                By.xpath("//button[contains(text(), 'Password')]"));
        assertTrue("Password button is not displayed", passwordButton.isDisplayed());
    }

    @Test
    public void testProfileAndPasswordInteraction() {
        // 1. Click on Profile button and verify Profile Settings
        WebElement profileButton = driver.findElement(
                By.xpath("//button[contains(text(), 'Profile')]"));
        profileButton.click();

        // Verify Profile Settings section appears
        WebElement profileTitle = driver.findElement(
                By.xpath("//h6[contains(text(), 'Profile Settings')]"));
        assertTrue("Profile Settings title is not displayed", profileTitle.isDisplayed());

        // Verify profile form fields
        WebElement usernameField = driver.findElement(
                By.xpath(
                        "//label[contains(text(), 'Username')]/ancestor::div[contains(@class, 'MuiFormControl-root')]"));
        assertTrue("Username field is not displayed", usernameField.isDisplayed());

        WebElement emailField = driver.findElement(
                By.xpath("//label[contains(text(), 'Email')]/ancestor::div[contains(@class, 'MuiFormControl-root')]"));
        assertTrue("Email field is not displayed", emailField.isDisplayed());

        // 2. Click on Password button and verify Password Settings
        WebElement passwordButton = driver.findElement(
                By.xpath("//button[contains(text(), 'Password')]"));
        passwordButton.click();

        // Verify Password Settings section appears
        WebElement passwordTitle = driver.findElement(
                By.xpath("//h6[contains(text(), 'Password Settings')]"));
        assertTrue("Password Settings title is not displayed", passwordTitle.isDisplayed());

        // Verify password form fields
        WebElement currentPasswordField = driver.findElement(
                By.xpath(
                        "//label[contains(text(), 'Current Password')]/ancestor::div[contains(@class, 'MuiFormControl-root')]"));
        assertTrue("Current Password field is not displayed", currentPasswordField.isDisplayed());

        WebElement newPasswordField = driver.findElement(
                By.xpath(
                        "//label[contains(text(), 'New Password')]/ancestor::div[contains(@class, 'MuiFormControl-root')]"));
        assertTrue("New Password field is not displayed", newPasswordField.isDisplayed());

        WebElement confirmPasswordField = driver.findElement(
                By.xpath(
                        "//label[contains(text(), 'Confirm Password')]/ancestor::div[contains(@class, 'MuiFormControl-root')]"));
        assertTrue("Confirm Password field is not displayed", confirmPasswordField.isDisplayed());

        // 3. Test toggling back to Profile to ensure two-way toggle works
        driver.findElement(By.xpath("//button[contains(text(), 'Profile')]")).click();

        assertTrue(
                "Profile Settings is not displayed after toggling back",
                driver.findElement(By.xpath("//h6[contains(text(), 'Profile Settings')]")).isDisplayed());
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}