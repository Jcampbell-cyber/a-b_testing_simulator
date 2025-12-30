import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Alpha (α)',
    definition: 'The significance level of a test, representing the probability of making a Type I error (false positive). Commonly set at 0.05, meaning a 5% chance of rejecting a true null hypothesis.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Beta (β)',
    definition: 'The probability of making a Type II error (false negative), which is failing to reject a false null hypothesis. Statistical power is calculated as 1 - β.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Statistical Power',
    definition: 'The probability of correctly rejecting a false null hypothesis, calculated as 1 - β. Higher power means a better chance of detecting a true effect when it exists.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'P-value',
    definition: 'The probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true. A smaller p-value provides stronger evidence against the null hypothesis.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Effect Size',
    definition: 'A quantitative measure of the magnitude of a phenomenon. Common measures include Cohen\'s d, which represents the standardized difference between two means.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Null Hypothesis (H₀)',
    definition: 'The default assumption that there is no effect or no difference between groups. Statistical tests aim to determine whether to reject this hypothesis.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Alternative Hypothesis (H₁)',
    definition: 'The hypothesis that contradicts the null hypothesis, suggesting that there is an effect or a difference between groups.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Type I Error',
    definition: 'A false positive error that occurs when the null hypothesis is incorrectly rejected when it is actually true. The probability of this error is equal to the significance level (α).',
    category: 'Errors',
  },
  {
    term: 'Type II Error',
    definition: 'A false negative error that occurs when the null hypothesis is incorrectly accepted when it is actually false. The probability of this error is denoted as β.',
    category: 'Errors',
  },
  {
    term: 'Peeking',
    definition: 'The practice of repeatedly checking test results before the planned end of an experiment. This inflates the false positive rate and can lead to incorrect conclusions.',
    category: 'Common Pitfalls',
  },
  {
    term: 'Family-Wise Error Rate (FWER)',
    definition: 'The probability of making at least one Type I error when conducting multiple hypothesis tests. Methods like Bonferroni correction control for this inflated error rate.',
    category: 'Multiple Testing',
  },
  {
    term: 'Bonferroni Correction',
    definition: 'A conservative method to control the family-wise error rate by dividing the significance level by the number of tests performed (α/n).',
    category: 'Multiple Testing',
  },
  {
    term: 'CUPED',
    definition: 'Controlled-experiment Using Pre-Experiment Data. A variance reduction technique that uses pre-experiment data to reduce noise and improve the sensitivity of A/B tests.',
    category: 'Advanced Techniques',
  },
  {
    term: 'Sample Size',
    definition: 'The number of observations or data points in a study. Larger sample sizes generally provide more precise estimates and greater statistical power.',
    category: 'Study Design',
  },
  {
    term: 'Confidence Interval',
    definition: 'A range of values that likely contains the true population parameter with a specified level of confidence (typically 95%). Wider intervals indicate more uncertainty.',
    category: 'Estimation',
  },
  {
    term: 'One-Sided Test',
    definition: 'A hypothesis test where the alternative hypothesis specifies a direction (greater than or less than). All of the significance level is placed in one tail of the distribution.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Two-Sided Test',
    definition: 'A hypothesis test where the alternative hypothesis does not specify a direction (simply not equal to). The significance level is split between both tails of the distribution.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Critical Value',
    definition: 'The threshold value that the test statistic must exceed to reject the null hypothesis. It is determined by the significance level and the sampling distribution.',
    category: 'Hypothesis Testing',
  },
  {
    term: 'Standard Error',
    definition: 'A measure of the variability of a sample statistic, typically the standard deviation of the sampling distribution. It decreases as sample size increases.',
    category: 'Estimation',
  },
  {
    term: 'Minimum Detectable Effect (MDE)',
    definition: 'The smallest effect size that can be detected with a given level of statistical power, sample size, and significance level.',
    category: 'Study Design',
  },
  {
    term: 'Guardrails',
    definition: 'Pre-specified thresholds for key metrics that, if crossed, trigger an early stop of the experiment to prevent significant harm.',
    category: 'Advanced Techniques',
  },
  {
    term: 'Sequential Testing',
    definition: 'Statistical methods that allow for valid interim analyses during an experiment without inflating the Type I error rate, unlike traditional peeking.',
    category: 'Advanced Techniques',
  },
  {
    term: 'Imbalanced Randomization',
    definition: 'Allocating different proportions of subjects to treatment and control groups (e.g., 80/20 split). This affects statistical power and sample size requirements.',
    category: 'Study Design',
  },
  {
    term: 'Cohen\'s d',
    definition: 'A standardized measure of effect size calculated as the difference between two means divided by the pooled standard deviation. Values of 0.2, 0.5, and 0.8 are considered small, medium, and large effects.',
    category: 'Effect Size',
  },
];

export function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(glossaryTerms.map((t) => t.category)))];

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-[#0017D2]" />
            <h1 className="text-4xl font-bold text-white">Statistical Glossary</h1>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            A comprehensive reference for statistical terms used in A/B testing and experimentation
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0017D2] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#0017D2] text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-5 hover:border-[#0017D2] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white">{item.term}</h3>
                    <span className="text-xs font-semibold text-[#0017D2] bg-[#0017D2]/10 px-2 py-1 rounded whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{item.definition}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No terms found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Additional Resources</h2>
          <div className="space-y-3 text-gray-300">
            <p className="leading-relaxed">
              For more in-depth explanations, consider exploring academic textbooks on experimental
              design, online courses on statistics, or research papers on A/B testing methodologies.
            </p>
            <p className="leading-relaxed text-sm">
              This glossary is designed to provide quick reference definitions. For practical
              applications, use the interactive calculators available throughout this site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
