# TPC Digital ID

## Adding people

Each person's page is generated from a row in `src/data/members.csv` and is served at `/<id>` (e.g. `/1`, `/2`). `/` shows the first row.

| Column | Notes |
| --- | --- |
| `id` | Used in the URL, e.g. `2` → `/2` |
| `name`, `role`, `email` | Shown on the card |
| `committee`, `college` | Optional; default to Training & Placement Committee / MES College of Engineering |
| `phone` | Phone button and saved contact; also used for WhatsApp if `whatsapp` is empty |
| `linkedin`, `instagram`, `whatsapp` | Full URLs (WhatsApp: number only). Empty columns hide the button |
| `photo` | Image URL for the card photo; leave empty to show the person's initials |
| `description` | Back of the card. Leave empty for a default based on role and committee |

Wrap any value containing a comma in double quotes. Rebuild/redeploy after editing the CSV.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
