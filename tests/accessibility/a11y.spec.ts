import AxeBuilder from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { test, expect } from '../../src/fixtures/fixtures';
import fs from 'fs';
import path from 'path';

test.skip(({ browserName }) => browserName !== 'chromium', 'A11y scans only run on Chromium');

interface KnownViolation {
    readonly ruleId: string;
    readonly reason: string;
    readonly wcagCriterion: string;
    readonly foundDate: string;
    readonly ticketUrl: string;
}

const KNOWN_VIOLATIONS: readonly KnownViolation[] = [
    {
        ruleId: 'select-name',
        reason: 'Third-party app - cannot fix. Sort dropdown has no accessible name, screen readers cannot identify the element.',
        wcagCriterion: 'wcag2a, wcag412',
        foundDate: '18.02.2026',
        ticketUrl: '',
    },
];

const WCAG_TAGS = [
    'wcag2a', 'wcag2aa',     // WCAG 2.0
    'wcag21a', 'wcag21aa',   // WCAG 2.1 (current EU-Standard)
    'wcag22aa',              // WCAG 2.2 (upcoming EU-Standard)
] as const;

const knownRuleIds = KNOWN_VIOLATIONS.map(v => v.ruleId);

function analyzeAccessibility(results: AxeResults): void {
    const newViolations = results.violations.filter(v => !knownRuleIds.includes(v.id));
    const knownViolations = results.violations.filter(v => knownRuleIds.includes(v.id));
    const summary = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        wcag: v.tags.filter(t => t.startsWith('wcag')).join(', '),
        status: knownRuleIds.includes(v.id) ? '⚠️ KNOWN' : '🔴 NEW',
    }));

    if (results.violations.length > 0 ) {
        console.log(`Violations found: ${results.violations.length} total (${knownViolations.length} known, ${newViolations.length} new)`);
        console.table(summary);
    }

    const report = results.violations.map(violation => {
        return {
            ruleId: violation.id,
            impact: violation.impact,
            description: violation.help,
            helpUrl: violation.helpUrl,
            wcagTags: violation.tags.filter(t => t.startsWith('wcag')),

            affectedElements: violation.nodes.map(node => node.html),

            status: knownRuleIds.includes(violation.id) ? '⚠️ KNOWN' : '🔴 NEW',
        };
    });

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const reportString = JSON.stringify(report, null, 2);
    const outputDir = path.join('test-results', 'a11y-reports');
    const outputPath = `${outputDir}/a11y-report-${timestamp}.json`;

    if (results.violations.length > 0){
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(outputPath, reportString)
        console.log(`✅ A11y Report written to: ${outputPath}`);
    }

    expect(newViolations).toEqual([]);
}


test.describe('Accessibility', () => {
    test('should scan login page', async ({ loginPage, page }) => {
        const results = await new AxeBuilder({ page })
            .withTags([...WCAG_TAGS])
            .analyze();
            
        analyzeAccessibility(results);
    });

    test('should scan inventory page', async ({ authenticatedPage, page }) => {
        const results = await new AxeBuilder({ page })
            .withTags([...WCAG_TAGS])
            .analyze();

        analyzeAccessibility(results);
    });
    
    test('known violation: select-name should still be present (canary)', async ({ authenticatedPage, page }) => {
        const results = await new AxeBuilder({ page })
            .withTags([...WCAG_TAGS])
            .analyze();

        const canaryFound = results.violations.find(v => v.id === 'select-name');
        // If this test fails, the bug was fixed upstream.
        // Action: remove 'select-name' from KNOWN_VIOLATIONS and delete this test.
        expect(canaryFound).toBeDefined();
    });
});