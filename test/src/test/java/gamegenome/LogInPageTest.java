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

public class LogInPageTest {

    private WebDriver driver;

    @Before
    public void setUp() {
        // WebDriverManager will automatically download and configure the driver
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.get("http://localhost:5173/login");
    }

    @Test
    public void testLogInPageElements() {
        // Verify the logo is displayed
        WebElement logo = driver.findElement(By.cssSelector(".logo"));
        assertTrue("Logo is not displayed", logo.isDisplayed());

        // Verify the form title
        WebElement formTitle = driver.findElement(By.tagName("h2"));
        assertTrue("Form title is not displayed", formTitle.isDisplayed());
        assertEquals("Log In", formTitle.getText());

        // Verify username field is present
        WebElement usernameField = driver.findElement(By.id("username"));
        assertTrue("Username field is not displayed", usernameField.isDisplayed());
        
        // Verify password field is present
        WebElement passwordField = driver.findElement(By.id("password"));
        assertTrue("Password field is not displayed", passwordField.isDisplayed());
        
        // Verify Log In button is present and clickable
        WebElement logInButton = driver.findElement(By.xpath("//button[contains(text(), 'Log In')]"));
        assertTrue("Log In button is not displayed", logInButton.isDisplayed());
    }
    
    @Test
    public void testFormInteraction() {
        // Fill out the form
        WebElement usernameField = driver.findElement(By.id("username"));
        usernameField.sendKeys("testuser");
        
        WebElement passwordField = driver.findElement(By.id("password"));
        passwordField.sendKeys("password123");
        
        // Submit the form
        WebElement logInButton = driver.findElement(By.xpath("//button[contains(text(), 'Log In')]"));
        logInButton.click();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}