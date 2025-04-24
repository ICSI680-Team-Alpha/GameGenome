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

public class SignUpPageTest {

    private WebDriver driver;

    @Before
    public void setUp() {
        // WebDriverManager will automatically download and configure the driver
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.get("http://localhost:5173/signup");
    }

    @Test
    public void testSignUpPageElements() {
        // Verify the logo is displayed
        WebElement logo = driver.findElement(By.cssSelector(".logo"));
        assertTrue("Logo is not displayed", logo.isDisplayed());

        // Verify the form title
        WebElement formTitle = driver.findElement(By.tagName("h2"));
        assertTrue("Form title is not displayed", formTitle.isDisplayed());
        assertEquals("Sign Up", formTitle.getText());

        // Verify username field is present
        WebElement usernameField = driver.findElement(By.id("username"));
        assertTrue("Username field is not displayed", usernameField.isDisplayed());

        // Verify email field is present
        WebElement emailField = driver.findElement(By.id("email"));
        assertTrue("Email field is not displayed", emailField.isDisplayed());
        
        // Verify password field is present
        WebElement passwordField = driver.findElement(By.id("password"));
        assertTrue("Password field is not displayed", passwordField.isDisplayed());
        
        // Verify confirm password field is present
        WebElement confirmPasswordField = driver.findElement(By.id("confirm-password"));
        assertTrue("Confirm password field is not displayed", confirmPasswordField.isDisplayed());

        // Verify Sign Up button is present and clickable
        WebElement signUpButton = driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        assertTrue("Sign Up button is not displayed", signUpButton.isDisplayed());
    }
    
    @Test
    public void testFormInteraction() {
        // Fill out the form
        WebElement usernameField = driver.findElement(By.id("username"));
        usernameField.sendKeys("testuser");
        
        WebElement emailField = driver.findElement(By.id("email"));
        emailField.sendKeys("test@example.com");
        
        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.sendKeys("password123");
        
        WebElement confirmPasswordField = driver.findElement(By.id("confirm-password"));
        confirmPasswordField.sendKeys("password123");
        
        // Submit the form
        WebElement signUpButton = driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        signUpButton.click();
        
        // Here you would add assertions to verify successful form submission
        // For example: check for success message or redirection
        // This depends on your application's behavior after form submission
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}