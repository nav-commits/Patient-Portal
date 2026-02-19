# Med Health Laboratory – Patient Portal

A secure **Next.js** application that allows patients to view and download their medical test results, such as blood, urine, and other lab tests. Built with **Chakra UI** for a modern, accessible interface and **React PDF** for downloading results.

<img width="1425" height="1125" alt="Screenshot 2026-02-13 at 9 11 46 PM" src="https://github.com/user-attachments/assets/96e07e46-61c9-408e-9b81-b036ec31a4f9" />
<img width="1863" height="1157" alt="Screenshot 2026-02-13 at 9 12 19 PM" src="https://github.com/user-attachments/assets/31858432-42cd-40ef-a587-b233c0acf55c" />
<img width="1860" height="1119" alt="Screenshot 2026-02-13 at 9 12 35 PM" src="https://github.com/user-attachments/assets/7712644f-7e1e-46d7-a19d-ff0529e869d1" />
<img width="1865" height="1153" alt="Screenshot 2026-02-13 at 9 12 58 PM" src="https://github.com/user-attachments/assets/9b52c11c-788c-43c2-8d2e-87092e753652" />

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
- **Firebase Firestore (SDK v9+)** – Database for patient and test data  

---

## ⚡ Features

- View personal patient information (fetched from Firestore)  
- Display a list of test results (blood, urine, etc.) from Firestore  
- **Line charts** for tracking results over time using Chakra UI Charts  
- Download results as PDF  
- Status tracking for each test  
- Responsive, professional UI  
- Real-time data powered by Firestore  

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

All data displayed in the PDF is dynamically fetched from Firestore.

---

## 🔥 Database

- **Patients** – Name, contact info, and avatar stored in Firestore  
- **Test Results** – Blood, urine, and other lab tests stored in Firestore  
- **PDF Data** – Generated dynamically from Firestore records  

> All application data is fetched from Firebase Firestore.

---

## ⚙️ Scripts

- `dev` – Start development server  
- `build` – Build production app  
- `start` – Run production server  
- `lint` – Run ESLint  

---

## 📌 Notes

- This project uses **Firebase Firestore** instead of mock data.  
- Real authentication and Firestore security rules should be implemented before production use.  
- UI and charts are fully built with **Chakra UI**, no Tailwind CSS used.  

---

**Author:** Navdeep Dhamrait  
**Repository:** [Patient Portal](https://github.com/nav-commits/Patient-Portal)

