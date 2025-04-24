package gamegenome;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import io.github.bonigarcia.wdm.WebDriverManager;

import static org.junit.Assert.assertTrue;

public class WelcomePageTest {

    private WebDriver driver;

    @Before
    public void setUp() {
        // WebDriverManager will automatically download and configure the driver
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.get("http://localhost:5173/"); // Replace with your local server URL
    }

    @Test
    public void testWelcomePageElements() {
        // Verify the logo is displayed
        WebElement logo = driver.findElement(By.cssSelector(".logo"));
        assertTrue("Logo is not displayed", logo.isDisplayed());

        // Verify the "Sign Up" button is present and clickable
        WebElement signUpButton = driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        assertTrue("Sign Up button is not displayed", signUpButton.isDisplayed());
        signUpButton.click();

        // Verify the "Log in" button is present and clickable
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Log in')]"));
        assertTrue("Log in button is not displayed", loginButton.isDisplayed());
        loginButton.click();

        // Verify the "Get Started Now" button is present and clickable
        WebElement getStartedButton = driver.findElement(By.xpath("//button[contains(text(), 'Get Started Now')]"));
        assertTrue("Get Started Now button is not displayed", getStartedButton.isDisplayed());
        getStartedButton.click();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}