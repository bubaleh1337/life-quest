import { expect, test } from "@playwright/test";

test("landing exposes a zero-friction demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Life Quest", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Посмотреть демо|View demo/ })).toBeVisible();
});

test("demo opens with populated data and navigation", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText(/Демо-режим|Demo mode/)).toBeVisible();
  await expect(page.getByText(/Собрать портфолио|Build a portfolio/).first()).toBeVisible();

  await page.getByRole("button", { name: /Награды|Rewards/ }).click();
  await expect(page.getByRole("heading", { name: /Награды за путь|Rewards for the path/ })).toBeVisible();
});

test("reward preset fills and clears custom XP field", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Награды|Rewards/ }).click();

  const preset = page.getByRole("button", { name: /Обычная|Regular/ });
  const input = page.getByRole("textbox", { name: /Ещё XP|More XP/ });

  await preset.click();
  await expect(input).toHaveValue("50");
  await preset.click();
  await expect(input).toHaveValue("");
});

test("account menu closes on outside click", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Меню аккаунта|Account menu/ }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("heading", { name: /Сегодня|Today/ }).click();
  await expect(page.getByRole("menu")).toBeHidden();
});

test("privacy page is public", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Конфиденциальность|Privacy/ })).toBeVisible();
  await expect(page.getByText(/Supabase/)).toBeVisible();
  await expect(page.getByText(/Vercel/)).toBeVisible();
});

test("demo League is opt-in and shows weekly ranking after joining", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /Лига|League/ }).click();
  await expect(page.getByRole("heading", { name: /Лига Life Quest|Life Quest League/ })).toBeVisible();
  await page.getByRole("textbox", { name: /Имя в Лиге|League name/ }).fill("Comet");
  await page.getByRole("button", { name: /Вступить в Лигу|Join the League/ }).click();
  await expect(page.getByText("#24")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Luna" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Твои трофеи|Your trophies/ })).toHaveCount(0);

  await page.getByRole("button", { name: /Меню аккаунта|Account menu/ }).click();
  await page.getByRole("menuitem", { name: /Профиль|Profile/ }).click();
  await expect(page.getByRole("dialog", { name: /Профиль игрока|Player profile/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Твои трофеи|Your trophies/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Поделиться бейджем|Share badge/ }).first()).toBeVisible();
});
