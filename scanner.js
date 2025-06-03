// scanner.js

const structuralPatterns = [
  {
    id: "ZP_FLAG_P61",
    name: "主語の曖昧化構文",
    regex: /when (a|the|some)? ?(researcher|author|user|they|someone|people)? ?use(s)?/i,
    category: "cognitive",
    explanation: "単数か複数かが曖昧になり、責任主体の誤認につながる恐れがあります。"
  },
  {
    id: "ZP_FLAG_P62",
    name: "Modal動詞の強度消失構文",
    regex: /\b(may|might|could|would)\b/i,
    category: "legal",
    explanation: "「してもよい」が無条件許可と誤解される可能性があります。"
  },
  {
    id: "ZP_FLAG_P63",
    name: "否定スコープ曖昧化構文",
    regex: /not all (cases|users|examples|results)/i,
    category: "cognitive",
    explanation: "部分否定が全否定または完全肯定に読み替えられる誤解が生じます。"
  },
  {
    id: "ZP_FLAG_P64",
    name: "受動態の責任転嫁構文",
    regex: /\b(should|must|can|may) be [a-z]+ed\b/i,
    category: "legal",
    explanation: "誰がすべきかが不明確なまま義務が語られ、責任がぼやけます。"
  },
  {
    id: "ZP_FLAG_P65",
    name: "仮定法の現実化構文",
    regex: /if (someone|one|a person) were to [a-z]+/i,
    category: "cultural",
    explanation: "仮定の話が現実の許可や行動推奨と誤認されやすくなります。"
  }
];

function scanText() {
  const text = document.getElementById('textInput').value;
  if (!text.trim()) {
    alert('Please enter some text to scan.');
    return;
  }

  let totalRisks = 0;
  const results = {
    translation: [],
    legal: [],
    cultural: [],
    cognitive: []
  };

  structuralPatterns.forEach(pattern => {
    if (pattern.regex.test(text)) {
      results[pattern.category].push(pattern);
      totalRisks++;
    }
  });

  updateResults(results, totalRisks);
}

function updateResults(results, totalRisks) {
  // Clear previous output
  ['translationIssues', 'legalIssues', 'culturalIssues', 'cognitiveIssues'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  for (const category in results) {
    results[category].forEach(pattern => {
      const issueHTML = `
        <div class="problematic-phrase">
            <div class="phrase-text">Pattern: <code>${pattern.regex}</code></div>
            <div class="japanese-misunderstanding">
                <strong>⚠️ GPT構文照準：</strong> ${pattern.name}
            </div>
            <div class="cultural-explanation">
                <strong>🧠 誤読ポイント：</strong> ${pattern.explanation}
            </div>
            <div class="suggested-alternative">
                <strong>ID:</strong> <code>${pattern.id}</code>
            </div>
        </div>`;
      document.getElementById(`${category}Issues`).innerHTML += issueHTML;
    });
  }

  const riskLevel = totalRisks === 0 ? 'LOW' : totalRisks < 3 ? 'MEDIUM' : totalRisks < 6 ? 'HIGH' : 'CRITICAL';
  document.getElementById('riskCount').textContent = totalRisks;
  document.getElementById('riskLevel').textContent = riskLevel;
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
