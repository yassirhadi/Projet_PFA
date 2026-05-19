from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Importer les modules du pipeline directement
from extraction import extraire_offre
from classification_section import classifier_cv, classifier_offre

try:
    from metier import detecter_metier_cluster
    METIER_READY = True
except ImportError:
    METIER_READY = False

try:
    from scoring import calculer_score
    SCORE_READY = True
except ImportError:
    SCORE_READY = False

try:
    from recommendation import generer_recommandations
    RECO_READY = True
except ImportError:
    RECO_READY = False

app = FastAPI()


@app.post("/analyze")
async def analyze_cv(request: Request):
    """
    Point d'entrée appelé par Spring Boot.
    Reçoit le texte brut du CV (déjà extrait par Java) + description de l'offre.
    Bypasse l'extraction fichier — travaille directement sur le texte.
    """
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(
            content={"status": "error", "message": "JSON invalide"},
            status_code=400
        )

    # Accepter cv_text ou cvContent
    cv_text = data.get("cv_text") or data.get("cvContent", "")
    job_description = data.get("job_description") or data.get("jobDescription", "")

    if not cv_text or not job_description:
        return JSONResponse(
            content={"status": "error", "message": "cv_text et job_description sont requis"},
            status_code=400
        )

    try:
        # ── 1. Simuler le format de sortie d'extraire_cv() ────────────────
        # extraire_cv() retourne {"type": "cv", "content": "..."}
        # On injecte directement le texte reçu de Java
        json_cv_brut = {
            "type": "cv",
            "content": cv_text
        }

        # ── 2. Extraire l'offre normalement ───────────────────────────────
        offre_json = json.dumps({"offre": job_description}, ensure_ascii=False)
        json_offre_brut = extraire_offre(offre_json)

        # ── 3. Classification des sections ────────────────────────────────
        cv_sections = classifier_cv(json_cv_brut)
        offre_sections = classifier_offre(json_offre_brut)

        # ── 4. Détection métier ───────────────────────────────────────────
        if METIER_READY:
            metier_cluster = detecter_metier_cluster(offre_sections["sections"])
        else:
            metier_cluster = {"metier_detecte": "en_cours", "cluster_maroc": "en_cours", "poids": 1.0}

        # ── 5. Score ──────────────────────────────────────────────────────
        if SCORE_READY:
            score = calculer_score(cv_sections, offre_sections, poids=metier_cluster["poids"])
        else:
            score = {"status": "en_cours", "score_final": 0, "niveau": "Non calculé"}

        # ── 6. Recommandations ────────────────────────────────────────────
        if RECO_READY:
            recommandations = generer_recommandations(cv_sections, offre_sections, score)
        else:
            recommandations = {"status": "en_cours", "manquants": [], "bonus": [], "resume": ""}

        # ── 7. Résultat final ─────────────────────────────────────────────
        return JSONResponse(content={
            "status": "success",
            "metier_detecte": metier_cluster["metier_detecte"],
            "cluster_maroc": metier_cluster["cluster_maroc"],
            "cv": cv_sections,
            "offre": offre_sections,
            "score": score,
            "recommandations": recommandations
        })

    except Exception as e:
        return JSONResponse(
            content={"status": "error", "message": str(e)},
            status_code=500
        )


@app.get("/health")
async def health():
    return {
        "status": "UP",
        "modules": {
            "scoring": SCORE_READY,
            "recommendation": RECO_READY,
            "metier": METIER_READY
        }
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)