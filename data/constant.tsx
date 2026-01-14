import { themeToCssVars } from "./Themes";

export const suggestions = [
  {
    icon: '✈️',
    name: 'Travel Planner App',
    description: 'Trip planning dashboard with maps, itineraries, and booking cards. Clean modern layout with soft colors.'
  },
  {
    icon: '🎓',
    name: 'AI Learning Platform',
    description: 'Gamified learning experience with progress steps and streaks. Friendly, engaging, and colorful UI.'
  },
  {
    icon: '💰',
    name: 'Finance Tracker',
    description: 'Expense tracking dashboard with charts and budget goals. Minimal UI with dark mode support.'
  },
  {
    icon: '🛒',
    name: 'E-commerce Store',
    description: 'Product browsing and checkout experience. Premium UI with strong call-to-action design.'
  },
  {
    icon: '🗓️',
    name: 'Smart To-Do Planner',
    description: 'Task management with calendar and priority views. Simple productivity-focused interface.'
  },
  {
    icon: '🍔',
    name: 'Food Delivery App',
    description: 'Restaurant listings and fast ordering flow. Bright visuals with large food images.'
  },
  {
    icon: '🧩',
    name: 'Kids Learning App',
    description: 'Interactive learning app for kids with rewards. Colorful UI and playful illustrations.'
  }
]



export  const HtmlWrapper = (theme:any, htmlCode: string) =>{ 
  return`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

  <style>
    ${themeToCssVars(theme)}
  </style>
</head>

<body style="background: var(--background); color: var(--foreground); width:100%;">
  ${htmlCode ?? ""}
</body>
</html>
`};
 