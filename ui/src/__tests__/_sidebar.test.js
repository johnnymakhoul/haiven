// © 2024 Thoughtworks, Inc. | Licensed under the Apache License, Version 2.0  | See LICENSE.md file for permissions.
import { render, screen } from "@testing-library/react";
import { act } from "react";
import Sidebar from "../pages/_sidebar";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useRouter } from "next/router";

vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPrompts = [
    {
      identifier: "1",
      title: "User person creation",
      categories: ["research"],
    },
    {
      identifier: "2",
      title: "Contract Test Generation",
      categories: ["testing"],
    },
    {
      identifier: "3",
      title: "Architecture Discussion",
      categories: ["coding"],
    },
  ];

  it("should render default menu items", async () => {
    useRouter.mockReturnValue({
      pathname: "/scenarios",
    });

    await act(async () => {
      render(<Sidebar prompts={[]} featureToggleConfig={{}} />);
    });

    expect(
      screen.getByRole("link", { name: /Dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Chat with Haiven/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ideate/i)).toBeInTheDocument();
    expect(screen.queryByText(/Architecture/i)).not.toBeInTheDocument(); // No hard-coded entry, so it shouldn't show up
  });

  it("should render menu items with prompts", async () => {
    useRouter.mockReturnValue({
      pathname: "/scenarios",
    });

    await act(async () => {
      render(<Sidebar prompts={mockPrompts} featureToggleConfig={{}} />);
    });

    expect(screen.getByText(/Research/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Coding/i)).toBeInTheDocument();

    await act(async () => {
      screen.getByText(/Research/i).click();
    });
    expect(screen.getByText(/User person creation/i)).toBeInTheDocument();
  });

  it("should show sub menu items if clicked menu item", async () => {
    useRouter.mockReturnValue({
      pathname: "/scenarios",
    });

    await act(async () => {
      render(<Sidebar prompts={mockPrompts} featureToggleConfig={{}} />);
    });

    await act(async () => {
      screen.getByText(/Research/i).click();
    });

    expect(screen.getByText(/User person creation/i)).toBeInTheDocument();
  });

  describe("Sidebar Component - Delivery Management Feature Toggle via Env", () => {
    const mockPromptsForDeliveryManagement = [
      {
        identifier: "ahm-process",
        title: "AHM Process",
        categories: ["deliveryManagement"],
        type: "chat",
        show: true,
      },
    ];

    const mockPromptsForOtherCategory = [
      {
        identifier: "creative-matrix",
        title: "Creative Matrix",
        categories: ["something-else"],
        type: "static",
        show: true,
      },
    ];

    it("should render Delivery Management category and its prompt when feature flag is true", async () => {
      const Sidebar = (await import("../pages/_sidebar")).default;

      useRouter.mockReturnValue({
        pathname: "/delivery-management",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsForDeliveryManagement}
            featureToggleConfig={{ THOUGHTWORKS: true }}
          />,
        );
      });

      expect(screen.getByText(/^Delivery/i)).toBeInTheDocument();
      const deliveryManagement = screen.getByText(/^Delivery/i);
      await act(async () => {
        deliveryManagement.click();
      });
      expect(screen.getByText(/AHM Process/i)).toBeInTheDocument();
    });

    it("should NOT render Delivery Management category when feature flag is false", async () => {
      const Sidebar = (await import("../pages/_sidebar")).default;

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsForDeliveryManagement}
            featureToggleConfig={{ THOUGHTWORKS: false }}
          />,
        );
      });

      expect(screen.queryByText(/^Delivery/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/AHM Process/i)).not.toBeInTheDocument();
    });

    it("should NOT render Delivery Management category when feature flag is not set", async () => {
      const Sidebar = (await import("../pages/_sidebar")).default;

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsForDeliveryManagement}
            featureToggleConfig={{}}
          />,
        );
      });

      expect(screen.queryByText(/^Delivery/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/AHM Process/i)).not.toBeInTheDocument();
    });

    it("should always render items under others regardless of the feature flag", async () => {
      const Sidebar = (await import("../pages/_sidebar")).default;

      useRouter.mockReturnValue({
        pathname: "/creative-matrix",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsForOtherCategory}
            featureToggleConfig={{ THOUGHTWORKS: false }}
          />,
        );
      });

      expect(screen.getByText(/Ideate/i)).toBeInTheDocument();
      const ideate = screen.getByText(/Ideate/i);
      await act(async () => {
        ideate.click();
      });
      expect(screen.getByText(/Creative Matrix/i)).toBeInTheDocument();
    });
  });

  describe("Grounded Research Icon", () => {
    const mockPromptsWithGroundedAttribute = [
      {
        identifier: "grounded-research-1",
        title: "Company Research Analysis",
        categories: ["research"],
        type: "chat",
        show: true,
        grounded: true,
      },
      {
        identifier: "regular-prompt",
        title: "Regular Prompt",
        categories: ["research"],
        type: "chat",
        show: true,
        grounded: false,
      },
    ];

    it("should render RiGlobalLine icon for grounded research items", async () => {
      useRouter.mockReturnValue({
        pathname: "/scenarios",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsWithGroundedAttribute}
            featureToggleConfig={{}}
          />,
        );
      });

      const researchCategory = screen.getByText(/Research/i);
      await act(async () => {
        researchCategory.click();
      });

      // Check if the icon is present for company research item
      const companyResearchItem = screen.getByText(
        /Company Research Analysis/i,
      );
      expect(companyResearchItem.closest("a")).toContainHTML("svg");

      // Check if the icon is not present for regular item
      const regularItem = screen.getByText(/Regular Prompt/i);
      expect(regularItem.closest("a")).not.toContainHTML("svg");
    });

    it("should maintain correct sorting with icons", async () => {
      useRouter.mockReturnValue({
        pathname: "/scenarios",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsWithGroundedAttribute}
            featureToggleConfig={{}}
          />,
        );
      });

      const researchCategory = screen.getByText(/Research/i);
      await act(async () => {
        researchCategory.click();
      });

      const items = screen.getAllByRole("link");
      const itemTexts = items.map((item) => item.textContent.trim());

      // Verify that items are sorted alphabetically regardless of icon presence
      expect(itemTexts).toEqual([
        "Dashboard",
        "Chat with Haiven",
        "Company Research Analysis",
        "Regular Prompt",
      ]);
    });
  });

  describe("Thoughtworks-only Categories", () => {
    const mockPromptsWithThoughtworksOnlyCategory = [
      {
        identifier: "client-research-prompt",
        title: "Client Research Prompt",
        categories: ["client-research"],
        type: "chat",
        show: true,
      },
      {
        identifier: "regular-prompt",
        title: "Regular Prompt",
        categories: ["architecture"],
        type: "chat",
        show: true,
      },
    ];

    it("should not add Thoughtworks-only category prompts to 'Other' when feature flag is false", async () => {
      const Sidebar = (await import("../pages/_sidebar")).default;

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(
          <Sidebar
            prompts={mockPromptsWithThoughtworksOnlyCategory}
            featureToggleConfig={{ THOUGHTWORKS: false }}
          />,
        );
      });

      // Architecture category should be present
      const architectureCategory = screen.getByText(/Architecture/i);
      await act(async () => {
        architectureCategory.click();
      });

      // The regular prompt should be there
      expect(screen.getByText(/Regular Prompt/i)).toBeInTheDocument();

      // The client research prompt should not be added anywhere
      expect(
        screen.queryByText(/Client Research Prompt/i),
      ).not.toBeInTheDocument();

      // Other category should not be present at all
      expect(screen.queryByText(/Other/i)).not.toBeInTheDocument();
    });
  });

  describe("Analyse Category Ordering", () => {
    it("should render Requirements Constraints under Analyse directly below Requirements Breakdown", async () => {
      const analysisPrompts = [
        {
          identifier: "requirements-constraints-volere-4a1b2c3d",
          title: "Requirements Constraints",
          categories: ["analysis"],
          type: "cards",
          show: true,
        },
        {
          identifier: "epic-discussion-multistep-9456678f",
          title: "Epic Discussion",
          categories: ["analysis"],
          type: "chat",
          show: true,
        },
        {
          identifier: "requirements-breakdown-3a845a85",
          title: "Requirements Breakdown",
          categories: ["analysis"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(
          <Sidebar prompts={analysisPrompts} featureToggleConfig={{}} />,
        );
      });

      const analyseCategory = screen.getByText(/Analyse/i);
      await act(async () => {
        analyseCategory.click();
      });

      const links = screen.getAllByRole("link");
      const linkTexts = links.map((link) => link.textContent.trim());

      const breakdownIdx = linkTexts.indexOf("Requirements Breakdown");
      const constraintsIdx = linkTexts.indexOf("Requirements Constraints");

      expect(breakdownIdx).toBeGreaterThan(-1);
      expect(constraintsIdx).toBe(breakdownIdx + 1);
      expect(
        screen
          .getByText("Requirements Constraints")
          .closest("a")
          .getAttribute("href"),
      ).toBe("/cards?prompt=requirements-constraints-volere-4a1b2c3d");
    });

    it("should render Baseline Architecture Assessment under Architecture and Analyse", async () => {
      const togafPrompts = [
        {
          identifier: "togaf-baseline-assessment-cards-7b2e9a1c",
          title: "Baseline Architecture Assessment",
          categories: ["architecture", "analysis"],
          type: "cards",
          show: true,
        },
        {
          identifier: "threat-modelling-cdbaba6f",
          title: "Threat Modelling: STRIDE",
          categories: ["architecture"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(<Sidebar prompts={togafPrompts} featureToggleConfig={{}} />);
      });

      const architectureCategory = screen.getByText(/Architecture/i);
      await act(async () => {
        architectureCategory.click();
      });

      const togafLinks = screen.getAllByText(
        "Baseline Architecture Assessment",
      );
      expect(togafLinks.length).toBeGreaterThanOrEqual(1);
      expect(togafLinks[0].closest("a").getAttribute("href")).toBe(
        "/cards?prompt=togaf-baseline-assessment-cards-7b2e9a1c",
      );
    });

    it("should render Cost Analysis under Analyse and Architecture", async () => {
      const costPrompts = [
        {
          identifier: "cost-analysis-cards-5e8b3c1a",
          title: "Cost Analysis",
          categories: ["analysis", "architecture"],
          type: "cards",
          show: true,
        },
        {
          identifier: "requirements-constraints-volere-4a1b2c3d",
          title: "Requirements Constraints",
          categories: ["analysis"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(<Sidebar prompts={costPrompts} featureToggleConfig={{}} />);
      });

      const analyseCategory = screen.getByText(/Analyse/i);
      await act(async () => {
        analyseCategory.click();
      });

      const costLinks = screen.getAllByText("Cost Analysis");
      expect(costLinks.length).toBeGreaterThanOrEqual(1);
      expect(costLinks[0].closest("a").getAttribute("href")).toBe(
        "/cards?prompt=cost-analysis-cards-5e8b3c1a",
      );
    });

    it("should render Market Research under Research and Analyse", async () => {
      const marketPrompts = [
        {
          identifier: "market-research-cards-2c7f4e9b",
          title: "Market Research",
          categories: ["research", "analysis"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(<Sidebar prompts={marketPrompts} featureToggleConfig={{}} />);
      });

      const researchCategory = screen.getByText(/Research/i);
      await act(async () => {
        researchCategory.click();
      });

      const marketLinks = screen.getAllByText("Market Research");
      expect(marketLinks.length).toBeGreaterThanOrEqual(1);
      expect(marketLinks[0].closest("a").getAttribute("href")).toBe(
        "/cards?prompt=market-research-cards-2c7f4e9b",
      );
    });

    it("should render Architecture Decision Records under Architecture", async () => {
      const adrPrompts = [
        {
          identifier: "adr-cards-4f8a1c6e",
          title: "Architecture Decision Records",
          categories: ["architecture"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(<Sidebar prompts={adrPrompts} featureToggleConfig={{}} />);
      });

      const architectureCategory = screen.getByText(/Architecture/i);
      await act(async () => {
        architectureCategory.click();
      });

      const adrLinks = screen.getAllByText("Architecture Decision Records");
      expect(adrLinks.length).toBeGreaterThanOrEqual(1);
      expect(adrLinks[0].closest("a").getAttribute("href")).toBe(
        "/cards?prompt=adr-cards-4f8a1c6e",
      );
    });

    it("should render Schedule Estimation & Planning under Analyse and Architecture", async () => {
      const schedulePrompts = [
        {
          identifier: "schedule-estimation-cards-6b1d3e8f",
          title: "Schedule Estimation & Planning",
          categories: ["analysis", "architecture"],
          type: "cards",
          show: true,
        },
      ];

      useRouter.mockReturnValue({
        pathname: "/",
      });

      await act(async () => {
        render(
          <Sidebar prompts={schedulePrompts} featureToggleConfig={{}} />,
        );
      });

      const analyseCategory = screen.getByText(/Analyse/i);
      await act(async () => {
        analyseCategory.click();
      });

      const scheduleLinks = screen.getAllByText(
        "Schedule Estimation & Planning",
      );
      expect(scheduleLinks.length).toBeGreaterThanOrEqual(1);
      expect(scheduleLinks[0].closest("a").getAttribute("href")).toBe(
        "/cards?prompt=schedule-estimation-cards-6b1d3e8f",
      );
    });
  });
});

