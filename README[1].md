# Smaood — College Smart Canteen & Kitchen Portal

A complete, ready-to-deploy web application for **Smaood College Smart Canteen** featuring dual-role authentication (**Student** and **Canteen Admin**), live stock management, menu editing, and real-time order status tracking.

## Dual-User Roles & Demo Credentials

1. **🎓 Student Login / Signup**
   - **Demo Login:** Email: `student@college.edu` | Password: `123` (or click **Fill Student Demo** / create a new account).
   - **Capabilities:** Browse categories (*Breakfast, Snacks & Beverages, Lunch, Dinner, Cakes & Bakes, Today's Menu*), order items (*Samosa, Filter Coffee, Masala Dosa, Veg/Chicken Fried Rice, etc.*), choose pickup time slots, and check live order status (`Queued` → `Preparing` → `Ready` → `Picked Up`).

2. **👨‍🍳 Canteen Admin Login / Signup**
   - **Demo Login:** Email: `admin@smaood.com` | Password: `123` (or click **Fill Admin Demo**).
   - **New Admin Registration Passcode:** `admin123`
   - **Capabilities:**
     - **Add / Remove Food Items:** Add new dishes with name, category, price, initial stock count, prep time, and Veg/Non-Veg status, or delete existing items.
     - **Live Price & Stock Editor:** Update item prices (`₹`) and remaining stock counts inline—stock automatically decreases when students order.
     - **Order Status Management:** Update incoming student order tokens (`Queued` → `Preparing` → `Ready` → `Picked Up`).

## Deploy to Netlify
1. Extract `smaood-smart-canteen.zip`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag-and-drop the extracted `smaood-smart-canteen` folder.
3. Click **Deploy**.
