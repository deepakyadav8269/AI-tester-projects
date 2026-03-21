package com.enterprise.base;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class BaseTest {
    // ThreadLocal ensures thread safety for parallel execution (Enterprise standard)
    protected static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    @BeforeMethod
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        // Initialize WebDriver
        driver.set(new ChromeDriver(options));
        // Note: Removed implicitlyWait because mixing Implicit Wait and Explicit Wait (WebDriverWait) is an anti-pattern.
        
        getDriver().get("https://login.salesforce.com/?locale=in");
    }

    public WebDriver getDriver() {
        return driver.get();
    }

    @AfterMethod
    public void tearDown() {
        if (getDriver() != null) {
            getDriver().quit();
            driver.remove(); // Clean up thread reference
        }
    }
}
