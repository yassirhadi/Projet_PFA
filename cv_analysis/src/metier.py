# src/metier.py

import os
import pickle
import re
import numpy as np

# ── Chemins : src/ → remonter 1 niveau vers cv_analysis/
BASE   = os.path.dirname(os.path.abspath(__file__))       # src/
MODELS = os.path.join(BASE, "..", "models")               # models/
OUT    = os.path.join(BASE, "..", "outputs")              # outputs/


def _normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = text.replace("é", "e").replace("è", "e").replace("ê", "e")
    text = text.replace("à", "a").replace("ù", "u").replace("ô", "o")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ══════════════════════════════════════════
# DETECTION DU METIER DE L'OFFRE
# ══════════════════════════════════════════

ROLE_PATTERNS = [
    (r"\bbusiness analyst\b|\bamoa\b",                         "Business Analyst / AMOA"),
    (r"\bdata scientist\b|\bdata engineer\b",                  "Data / BI"),
    (r"\bdeveloppeur\b|\bdeveloper\b|\bdevops\b|\bingenieur logiciel\b", "Développement IT"),
    (r"\bcomptable\b|\bfinance\b|\bcontrole de gestion\b",    "Finance / Comptabilité"),
    (r"\bingenieur\b|\bingenierie\b",                          "Ingénierie"),
    (r"\bchef de projet\b|\bproject manager\b|\bpm\b",        "Gestion de projet"),
    (r"\bcommercial\b|\bvente\b|\bbusiness developer\b",       "Commercial / Vente"),
    (r"\bmarketing\b|\bdigital marketing\b",                   "Marketing / Communication"),
    (r"\brh\b|\brecrutement\b|\bressources humaines\b",        "Ressources Humaines"),
    (r"\bqa\b|\btest\b|\btester\b",                           "QA / Testing"),
    (r"\bsupport\b|\bhelpdesk\b|\bservice client\b",           "Support / Service client"),
]


def detecter_metier_texte(texte: str) -> str:
    t = _normalize_text(texte)
    for pattern, label in ROLE_PATTERNS:
        if re.search(pattern, t):
            return label
    return "Métier non défini"


# ══════════════════════════════════════════
# PREDICTION — depuis texte offre uniquement
# ══════════════════════════════════════════

def predict_depuis_offre(texte_offre: str) -> dict:
    model_path = os.path.join(MODELS, "kmeans1.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Modèle KMeans#1 introuvable : {model_path}\n"
            "Lance d'abord : models/train/train_kmeans_metier.py"
        )

    with open(model_path, "rb") as f:
        data = pickle.load(f)

    km        = data["km"]
    vec       = data["vec"]
    scaler    = data["scaler"]
    noms_map  = data["noms_map"]
    poids_map = data["poids_map"]

    texte_lower      = _normalize_text(texte_offre)
    X_tfidf          = vec.transform([texte_lower]).toarray()
    prestige_neutral = np.array([[0.5 * 5]])
    X                = np.hstack([X_tfidf, prestige_neutral])
    X_sc             = scaler.transform(X)

    cluster_id  = int(km.predict(X_sc)[0])
    cluster_nom = noms_map.get(cluster_id,  "PME / Locale")
    poids       = poids_map.get(cluster_nom, 1.0)

    return {"cluster": cluster_nom, "poids": poids}


# ══════════════════════════════════════════
# POINT D'ENTRÉE POUR main.py
# ══════════════════════════════════════════

def detecter_metier_cluster(sections: dict) -> dict:
    texte        = " ".join([v for v in sections.values() if v])
    cluster_info = predict_depuis_offre(texte)
    metier       = detecter_metier_texte(texte)

    return {
        "metier_detecte": metier,
        "cluster_maroc":  cluster_info["cluster"],
        "poids":          cluster_info["poids"],
        "explication":    f"cluster={cluster_info['cluster']} | poids={cluster_info['poids']}"
    }