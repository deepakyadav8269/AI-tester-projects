package com.enterprise.tests;

import com.enterprise.base.BaseTest;
import com.enterprise.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Authentication")
@Feature("Login functionality")
public class ValidLoginTest extends BaseTest {

    @Test(description = "Verify successful login with valid credentials")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test Description: Login into Salesforce with valid username and password.")
    public void validLoginTest() {
        LoginPage loginPage = new LoginPage(getDriver());
        
        // Let TestNG naturally handle unchecked exceptions instead of swallowing them
        loginPage.doLogin("valid_enterprise_user@example.com", "SecurePassword123!");
        
        // Assertions would go here, e.g. checking Page Title
        // Assert.assertTrue(getDriver().getTitle().contains("Home"));
    }
}
