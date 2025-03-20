# The QuantCoder Project  

QuantCoder is a tool designed to streamline the process of searching for research articles, downloading PDFs, summarizing content, and generating QuantConnect Python algorithms based on the extracted data. This project was initiated in November 2023 with the goal of leveraging large language models (LLMs) within the LangChain framework to autonomously develop trading algorithms.

## Background

The initial version of QuantCoder was a Python prototype that utilized a cognitive architecture described in the article ["Dual Agent Chatbots and Expert Systems Design"](https://towardsdev.com/dual-agent-chatbots-and-expert-systems-design-25e2cba434e9) published by Towards Dev. This version successfully coded a blended momentum and mean-reversion strategy, as explained in the article ["Outperforming the Market (1000% in 10 years)"](https://medium.com/coinmonks/how-to-outperform-the-market-fe151b944c77?sk=7066045abe12d5cf88c7edc80ec2679c), which garnered significant attention with over 10,000 impressions on LinkedIn.

## Current Evolution : QuantCoder v0.3

The current version, QuantCoder v0.3, is detailed in the article ["From Finance Papers to Trading Algorithms: An Automated Approach"](https://ai.gopubby.com/from-finance-papers-to-trading-algorithms-an-automated-approach-ccd2180ee306) and is available in this repository. It received notable attention in the publication AI Advances.

### Features

- **Search Articles**: Query the CrossRef API to find relevant journal articles.
- **List Articles**: View previously searched articles.
- **Download PDFs**: Download article PDFs using direct links or Unpaywall.
- **Summarize Articles**: Generate concise summaries of downloaded articles.
- **Generate QuantConnect Code**: Create QuantConnect Python algorithms based on article summaries.

### Usage

To launch the interactive mode of **QuantCLI**, follow these steps:

1. Open a terminal window (bash shell).
2. Navigate to the directory where `quantcli` is installed.
3. Type the following command and press `Enter`:

   ```bash
   quantcli interactive

### Articles and Strategies 

The folder 'Strategies and publications' contains articles of interest and trading strategies generated using the QuantCoder tool. These strategies may have been refined manually or enhanced using other LLM-based methods. Please note that the author assumes no responsibility for the performance, accuracy, or outcomes resulting from the use of these strategies. Traders are strongly advised to exercise due diligence, conduct thorough research, and independently validate any strategy before applying it in live trading or investment activities. Quantitative finance articles studied using QuantCoder are stored in the 'Downloads' folder. These articles may be featured in a dedicated article on Medium, providing further insights and analysis.

## Full-stack application : QuantCoder_FS 

QuantCoder v0.3 has been integrated as a coding engine in the full-stack version of QuantCoder, currently under development in a private repository. This full-stack version includes:

- **Chat with Fundamentals**: Instant financial analysis by accessing EODHD data.
- **Search Articles**: Locate relevant academic articles.
- **Summarize Articles**: Extract key insights from articles.
- **Code Articles**: Generate trading algorithms based on article summaries.

These workflows are designed to evolve continuously, improving with advancements in LLMs and cognitive frameworks. For transparency and collaboration, these workflows will be demonstrated as Jupyter notebooks in this repository and in relevant Medium articles.

For more details on the evolution of QuantCoder, see the article ["Towards Automating Quantitative Finance Research"](https://medium.com/ai-advances/towards-automating-quantitative-finance-research-c868a2a6477e), published on AI Advances.

## Project Status

As a part-time independent developer working outside of academic or financial institutions, progress is incremental. Currently, my primary source of funding comes from the alpha I generate through market activities. My greatest reward is the community's recognition and the positive feedback I receive, including from the QuantConnect community, reflected in the number of stars this project receives. I welcome collaborations and am available for contact via Gmail or Medium.

## License

The material contained this repo is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

