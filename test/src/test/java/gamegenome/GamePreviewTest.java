package gamegenome;

package com.example.gamepreview;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.Assert.*;

public class AppTest {
    private WebDriver driver;

    @Before
    public void setUp() {
        // WebDriverManager will automatically download and configure the driver
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.get("http://localhost:5173/account");
    }

    @Test
    public void testGamePreviewPageElements() {
        // 1. Check if the game title contains expected content
        WebElement title = driver.findElement(By.id("gamePreview-title"));
        assertTrue("Game title should be visible", title.isDisplayed());

        // 2. Verify the presence of key content
        WebElement description = driver.findElement(By.id("gamePreview-description"));
        assertTrue("Game description should be visible", description.isDisplayed());

        WebElement price = driver.findElement(By.className("price"));
        assertTrue("Price should be displayed", screenshot.isDisplayed());

        WebElement image = driver.findElement(By.id("gamepreview-image"));
        assertTrue("Game image section should exist", image.isDisplayed());
    }

    @After
    public void tearDown() {
        // Close browser after test
        if (driver != null) {
            driver.quit();
        }
    }
}