import { test, expect } from '@playwright/test';
const { availableExamples } = require('../pageObjects/availableExamples');
const checkboxStates = require('../constants/checkboxStates');


test('add and remove elements', async ({ page }) => {
    const availableExamplesPage = new availableExamples(page);
    //click on add remove elements link
    await availableExamplesPage.clickLinkByName('Add/Remove Elements');
    await availableExamplesPage.addAndRemoveElements(3);
});

test('Broken images', async ({ page }) => {
    const availableExamplesPage = new availableExamples(page);
    //click on add remove elements link
    await availableExamplesPage.clickLinkByName('Broken Images');
    await availableExamplesPage.brokenImages();
});

test('Hovers', async ({ page }) => {
    const availableExamplesPage = new availableExamples(page);

    //click on add remove elements link
    await availableExamplesPage.clickLinkByName('Hovers');
    await availableExamplesPage.mouseHover();

});

test('Dropdown', async ({ page }) => {
    const availableExamplesPage = new availableExamples(page);

    //click on add remove elements link
    await availableExamplesPage.clickLinkByName('Dropdown');
    await availableExamplesPage.selectDropdownOption('Option 1');

});
test('multiple windows', async ({ page }) => {
    const availableExamplesPage = new availableExamples(page);
    //click on add remove elements link
    await availableExamplesPage.clickLinkByName('Multiple Windows');

    // Wait for the new page to open when clicking the link
    const newPage = await availableExamplesPage.openLinkInNewWindow('Click Here');

    // Ensure the new page is loaded
    await newPage.waitForLoadState();

    // Assert content on the new page
    await availableExamplesPage.verifyHeading(newPage, 'New Window');
    await newPage.close();
});

test('checkbox', async ({ page }) => {
  const availableExamplesPage = new availableExamples(page);

  // Navigate to Checkboxes page
  await availableExamplesPage.clickLinkByName('Checkboxes');


  // Click by name instead of index
  await availableExamplesPage.clickCheckboxByName('checkbox 1');
  await page .pause();
  await availableExamplesPage.verifyCheckboxState('checkbox 1', checkboxStates.CHECKBOX_CHECKED);

  await availableExamplesPage.clickCheckboxByName('checkbox 2');
  await availableExamplesPage.verifyCheckboxState('checkbox 2', checkboxStates.CHECKBOX_CHECKED);
});

test('js alerts', async ({ page }) => {
  const availableExamplesPage = new availableExamples(page);

  // Navigate to Checkboxes page
  await availableExamplesPage.clickLinkByName('JavaScript Alerts');


    await availableExamplesPage.handleAlertAndVerify('alert', 'accept');
  await availableExamplesPage.handleAlertAndVerify('confirm', 'dismiss');
  await availableExamplesPage.handleAlertAndVerify('prompt', 'accept', 'Playwright');
});