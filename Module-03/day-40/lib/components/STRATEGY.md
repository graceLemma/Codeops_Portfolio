/ - Static - Landing page with today's specials; no user-specific data needed.
/menu - ISR (revalidate = 3600) - Fetched dishes, filter, category sidebar; updates a few times a day.
/menu/[id] - Static via params - Single dish view with generateStaticParams.
/cart - Client - Order lines and running ETB total; private state stored locally in the browser tab.
/checkout - Dynamic - Server action execution, validation, and security guards.