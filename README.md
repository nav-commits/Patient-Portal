# Med Health Laboratory – Patient Portal

A secure **Next.js** application that allows patients to view and download their medical test results, such as blood, urine, and other lab tests. Built with **Chakra UI** for a modern, accessible interface and **React PDF** for downloading results.

---

## 🏗️ Technology Stack

- **Next.js 16** – Server-side rendering and routing  
- **React 19** – Frontend library  
- **TypeScript 5** – Type safety  
- **Chakra UI 3** – Component library and theming  
- **@chakra-ui/charts 3** – Line charts and visualizations for test results  
- **@react-pdf/renderer 4** – PDF generation for test results  
- **Framer Motion 12** – Animations  
- **date-fns 4** – Date formatting  

---

## ⚡ Features

- View personal patient information  
- Display a list of test results (blood, urine, etc.)  
- **Line charts** for tracking results over time using Chakra UI Charts  
- Download results as PDF  
- Status tracking for each test  
- Responsive, professional UI  
- Mock data used for development  

---

## 🎨 Pages

1. **Home / Dashboard** – Overview of available tests and their status  
2. **Personal Details** – Patient profile information  
3. **Results** – Detailed test results with **line graphs** and download option  

---

## 📄 PDF Download

Test results can be exported as a **PDF** using the built-in download button on the results page. Each PDF includes:

- Patient information  
- Test type and date  
- Individual test results  
- Reference ranges  

---

## 🧪 Mock Data

- **Patients** – Name, contact info, and avatar  
- **Test Results** – Blood, urine, and other lab tests over time  
- **PDF Downloads** – Sample reports for testing PDF generation  

> All data is mock data for development purposes only.

---

## ⚙️ Scripts

- `dev` – Start development server  
- `build` – Build production app  
- `start` – Run production server  
- `lint` – Run ESLint  

---

## 📌 Notes

- This project is a **patient portal prototype**.  
- Real patient data and authentication should be implemented before production use.  
- UI and charts are fully built with **Chakra UI**, no Tailwind CSS used.  

---

**Author:** Navdeep Dhamrait  
**Repository:** [Patient Portal](https://github.com/nav-commits/Patient-Portal)

