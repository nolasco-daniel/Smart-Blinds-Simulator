
## 🏠 Smart Blinds Fuzzy Logic Design

### **Inputs**

* **Ambient Light**

  * Source: `100 - cloudCover` (from Weather API)
  * Linguistic Variables:

    * Low (0–30)
    * Mid (40–60)
    * High (60–80)

* **Temperature**

  * Source: Weather API
  * Linguistic Variables:

    * Low (0–30)
    * High (25–35)
    * Mid (35 and above)

---

### **Fuzzy Rules**

1. **IF** Ambient Light = Low **AND** Temperature = Low
   → Blinds Position = **95% (High Open)**

2. **IF** Ambient Light = Mid **AND** Temperature = Mid
   → Blinds Position = **55% (Medium Open)**

3. **IF** Ambient Light = High **AND** Temperature = High
   → Blinds Position = **5% (Low Open)**

---

### **Defuzzification**

* Apply weighted average of rule outputs.
* Constrain blinds position to range **0–100%**.

---

### **Outputs**

* **Blinds Position**: % open (0–100)
* **Classification**:

  * Very High Light
  * High Light
  * Mid Light
  * Low Light

---

### **Process Flow (Visual Layout)**

```
        🌤 Weather API
          /        \
 Cloud Cover       Temperature
     ↓                  ↓
 Ambient Light %   Temperature Value
     ↓                  ↓
 ┌───────────────────────────┐
 │     FUZZY INFERENCE       │
 │   - Membership Functions  │
 │   - Rule Evaluation       │
 └───────────────────────────┘
              ↓
       Defuzzification
              ↓
    ┌───────────────────┐
    │   Blinds Position │ → % Open (0–100)
    └───────────────────┘
              ↓
  Classification (Light Level)
```

--
