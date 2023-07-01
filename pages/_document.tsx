import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <title>Live Preview - Horizon AI Template Free</title>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=GTM-KC7D56Q`}
        />
        <Script
          defer
          data-site="horizon-ui.com"
          src={`https://api.nepcha.com/js/nepcha-analytics.js`}
        />
        <Script
          id="script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'GTM-KC7D56Q');
            `,
          }}
        />
        <link
          rel="canonical"
          href="https://www.horizon-ui.com/chatgpt-ai-template/"
        />

        <meta
          name="keywords"
          content="horizon ui, premium, premium ai css, premium ai css admin template, premium ai css admin dashboard, ai css, react, react.js, ai template, ai, ai css theme, ai css components, typescript, admin ai, free ai css, admin template ai css, ai css free admin dashboard, ai css admin dashboard, free ai css, admin template, free ai admin, ai panel, admin template ai css, best ai css admin, best ai admin template, react ai css admin, react ai css dashboard, react panel, react ai css template, chat gpt, chat gpt admin template, chat gpt admin react, chat gpt admin panel, chatgpt, chatgpt admin template, chatgpt admin react, chatgpt admin panel, react admin template, react free, react premium, react free dashboard, react free ai css dashboard, free admin template, free admin dashboard, free admin panel, react ai css, react ai css dashboard, react ai css free, react free premium, react ai css free dashboard, react free premium dashboard, ai admin dashboard, ai css free template, typescript, admin typescript, nextjs, nextjs admin, free nextjs, admin template nextjs, nextjs free admin dashboard, nextjs admin dashboard, typescript admin template, free typescript admin template, free typescript, free typescript admin, typescript panel, admin template typescript, best typescript admin, best typescript admin template, open source, react dashboard, react admin, react chakra admin, react chakra dashboard, react chakra template, react premium dashboard, dashboard, react free chakra dashboard, premium admin template, react chakra, react chakra dashboard, react chakra free, react chakra free dashboard, react free premium dashboard, chakra admin dashboard, admin dashboard, chakra ui free template, chakra ui admin template, AI template for React, Free AI template, ChatGPT Admin Template, React AI chatbot template, NextJS AI template, Chakra UI AI template, React chatbot development template, NextJS AI chat application template, Chakra UI AI-powered template, React AI-powered template, OpenAI ChatGPT template, AI chatbot template for React, Free ChatGPT Admin Template, React NextJS Chakra UI template, AI-powered chatbot template, Chatbot template for React, AI integration template, ChatGPT-powered React app, NextJS chatbot template, Chakra UI React AI template, AI-based chat template, OpenAI React template, Conversational AI template, ChatGPT NextJS Chakra UI template, React chat application template, AI-driven chatbot template, Free AI-powered React template, OpenAI-powered chatbot template, React-based AI template, NextJS AI chatbot development template, Chakra UI-powered chatbot template, AI assistant template, ChatGPT-powered NextJS app, React AI interface template, Chakra UI AI-powered chatbot template, AI template for chat applications, React chatbot UI template, NextJS AI integration template, Chakra UI AI chatbot template, AI-driven React application template, Free ChatGPT-powered template, OpenAI-powered React chatbot template, Chatbot UI template for React, AI-powered NextJS template, Chakra UI-powered AI template, React AI template for conversational apps, NextJS chatbot UI template, ChatGPT-based React app template, AI chatbot UI template, Free AI-powered chatbot template, OpenAI ChatGPT React template, AI-driven NextJS template, Chakra UI chatbot development template, AI template for messaging apps, React chatbot interface template, NextJS AI chat template, Chakra UI AI interface template, AI-powered React component template, OpenAI-powered chat application template, Conversational interface template, ChatGPT-powered NextJS chatbot template, React AI-powered chat interface template, Chakra UI AI-powered messaging template, AI template for React web applications, React chatbot UI component template, NextJS AI chat interface template, Chakra UI AI-powered chat application template, AI-driven React chatbot UI template, Free ChatGPT-powered React template, OpenAI-powered chatbot UI template, AI chatbot template for React applications,Prompt-based AI template, Prompt-driven React AI template, Prompt-powered chatbot template, React AI template with prompt support, ChatGPT Admin Template with prompt integration, NextJS prompt-based AI template, Chakra UI prompt-driven AI template, Prompt-based chatbot development template, AI template for React with prompt capabilities, Free prompt-powered AI template, ChatGPT-powered React AI template with prompt input, Prompt-driven NextJS chat application template, Chakra UI AI template with prompt interaction, AI-powered React template with prompt handling, OpenAI ChatGPT template with prompt support, Prompt-based AI chatbot template for React, Free ChatGPT Admin Template with prompt input, Prompt-supported React NextJS Chakra UI template, AI-powered chatbot template with prompt utilization, Chatbot template for React with prompt integration, AI integration template with prompt functionality, ChatGPT-powered React app with prompt support, NextJS chatbot template with prompt handling, Chakra UI React AI template with prompt input, AI-based chat template with prompt utilization, OpenAI React template with prompt integration, Conversational AI template with prompt input, ChatGPT NextJS Chakra UI template with prompt support, Prompt-driven React chat application template, AI-driven chatbot template with prompt input, Free AI-powered React template with prompt support"
        />
        <meta
          name="description"
          content="Live Preview Demo - Horizon AI Template Free, the world's best free & open source OpenAI ChatGPT Admin Template made with React, NextJS and Chakra UI! Start creating outstanding AI SaaS Apps, Projects & Prompts 10X faster."
        />

        <meta
          itemProp="name"
          content="Live Preview - Horizon AI Template Free"
        />
        <meta
          itemProp="description"
          content="Live Preview Demo - Horizon AI Template Free, the world's best free & open source OpenAI ChatGPT Admin Template made with React, NextJS and Chakra UI! Start creating outstanding AI SaaS Apps, Projects & Prompts 10X faster."
        />

        <meta
          itemProp="image"
          content="https://i.ibb.co/Qmym1qt/horizon-ai-template-presentation-image-open-source.png"
        />

        <meta name="twitter:card" content="product" />
        <meta name="twitter:site" content="@horizon_ui" />
        <meta
          name="twitter:title"
          content="Live Preview - Horizon AI Template Free"
        />

        <meta
          name="twitter:description"
          content="Live Preview Demo - Horizon AI Template Free, the world's best free & open source OpenAI ChatGPT Admin Template made with React, NextJS and Chakra UI! Start creating outstanding AI SaaS Apps, Projects & Prompts 10X faster."
        />
        <meta name="twitter:creator" content="@horizon_ui" />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/Qmym1qt/horizon-ai-template-presentation-image-open-source.png"
        />

        <meta
          property="og:title"
          content="Horizon AI Template - Trendiest OpenAI ChatGPT Admin Template for React, NextJS and Chakra UI. Start creating outstanding AI SaaS Apps, Projects & Prompts 10X faster."
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content="https://horizon-ui.com/chatgpt-ai-template/"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/Qmym1qt/horizon-ai-template-presentation-image-open-source.png"
        />
        <meta
          property="og:description"
          content="Live Preview Demo - Horizon AI Template Free, the world's best free & open source OpenAI ChatGPT Admin Template made with React, NextJS and Chakra UI! Start creating outstanding AI SaaS Apps, Projects & Prompts 10X faster."
        />
        <meta property="og:site_name" content="Horizon AI Template Free" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
