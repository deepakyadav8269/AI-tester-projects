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
public class InvalidLoginTest extends BaseTest {

    @Test(description = "Verify login failure with invalid credentials")
    @Severity(SeverityLevel.NORMAL)
    @Description("Test Description: Attempt to login into Salesforce with invalid credentials and verify error message.")
    public void invalidLoginTest() {
        LoginPage loginPage = new LoginPage(getDriver());
        
        loginPage.doLogin("invalid_user@example.com", "WrongPassword!");
        
        String errorMessage = loginPage.getErrorMessage();
        Assert.assertEquals(errorMessage, "Please check your username and password. If you still can't log in, contact your Salesforce administrator.");
    }
}
