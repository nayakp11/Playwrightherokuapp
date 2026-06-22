const { test, expect } = require('@playwright/test');
const alertMessages = require('../constants/alertMessages');
const checkboxStates = require('../constants/checkboxStates');

class availableExamples {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.addelementButton = page.getByRole('button', { name: 'Add Element' });
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.images = this.page.locator('.example img');
        this.mouseHoverImage = this.page.locator('.figure img');
        this.viewProfile = page.getByRole('link', { name: 'View profile' });
        this.nameText = page.locator('h5', { hasText: 'name:' });
        this.dropdown = this.page.locator('select#dropdown');
        this.heading = this.page.locator('h3');


    }

    async clickLinkByName(linkName) {
        await this.page.goto('/');
        await this.page.getByRole('link', { name: linkName }).click();
    }

    async addAndRemoveElements(count) {
        // Add elements dynamically
        for (let i = 0; i < count; i++) {
            await this.addelementButton.click();
        }

        // Verify count
        const items = this.deleteButton;
        await expect(items).toHaveCount(count);

        // Remove all elements
        for (let i = 0; i < count; i++) {
            await items.nth(0).click();
        }

        // Verify none remain
        await expect(items).toHaveCount(0);
    }


    async brokenImages() {
        const images = this.images;

        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate(el => el.naturalWidth);

            expect(naturalWidth).toBeGreaterThan(0); // if 0, image is broken
        }
    }

    async mouseHover() {
        const images = this.mouseHoverImage;
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            await img.hover();

            // Assertions after hover
            await expect(this.viewProfile).toBeVisible();
            await expect(this.nameText.nth(i)).toBeVisible();
        }
    }

    async selectDropdownOption(option) {
        await this.dropdown.click();
        await this.dropdown.selectOption({ label: option });
        // Get the selected option text
        const selectedText = await this.dropdown.evaluate(el => el.options[el.selectedIndex].text);
        expect(selectedText).toBe(option);
    }

    async verifyHeading(page, expectedHeading) {
        await expect(page.locator('h3')).toHaveText(expectedHeading);
    }

    async openLinkInNewWindow(linkName) {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            await this.page.getByRole('link', { name: linkName }).click(),
            ,
        ]);
        await newPage.waitForLoadState();
        return newPage;
    }


   // Click checkbox by name instead of index
  async clickCheckboxByName(name) {
    const index = checkboxStates.CHECKBOX_LABELS[name.toLowerCase()];
    if (index === undefined) {
      throw new Error(`Unknown checkbox name: ${name}`);
    }

    const checkbox = this.page.locator('form#checkboxes input[type="checkbox"]').nth(index);
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
      console.log(`${name} was not checked, so we checked it.`);
    } else {
      console.log(`${name} is already checked.`);
    }
  }

  async verifyCheckboxState(name, expectedState) {
    const index = checkboxStates.CHECKBOX_LABELS[name.toLowerCase()];
    if (index === undefined) {
      throw new Error(`Unknown checkbox name: ${name}`);
    }

    const checkbox = this.page.locator('form#checkboxes input[type="checkbox"]').nth(index);
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(expectedState);
  }

  
  async handleAlertAndVerify(alertType, action = 'accept', promptText = '') {
    this.page.once('dialog', async dialog => {
      if (dialog.type() === 'prompt' && action === 'accept') {
        await dialog.accept(promptText);
      } else if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });

    switch (alertType.toLowerCase()) {
      case 'alert':
        await this.page.click('button:has-text("Click for JS Alert")');
        await expect(this.page.locator('#result')).toHaveText(alertMessages.ALERT_SUCCESS);
        break;
      case 'confirm':
        await this.page.click('button:has-text("Click for JS Confirm")');
        const confirmText = action === 'accept' ? alertMessages.CONFIRM_OK : alertMessages.CONFIRM_CANCEL;
        await expect(this.page.locator('#result')).toHaveText(confirmText);
        break;
      case 'prompt':
        await this.page.click('button:has-text("Click for JS Prompt")');
        await expect(this.page.locator('#result')).toHaveText(alertMessages.PROMPT_TEXT(promptText));
        break;
      default:
        throw new Error(`Unknown alert type: ${alertType}`);
    }
  }
}

module.exports = { availableExamples };
