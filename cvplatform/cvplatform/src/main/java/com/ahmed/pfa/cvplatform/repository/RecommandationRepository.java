package com.ahmed.pfa.cvplatform.repository;

import com.ahmed.pfa.cvplatform.model.Recommandation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour les recommandations
 */
@Repository
public interface RecommandationRepository extends JpaRepository<Recommandation, Long> {

    /**
     * Trouver toutes les recommandations d'une analyse
     */
    List<Recommandation> findByAnalyseIAId(Long analyseIAId);

    /**
     * Trouver recommandations par priorité
     */
    List<Recommandation> findByAnalyseIAIdOrderByPrioriteAsc(Long analyseIAId);

    /**
     * Trouver recommandations par type
     */
    List<Recommandation> findByAnalyseIAIdAndType(Long analyseIAId, Recommandation.TypeRecommandation type);

    /**
     * SQL natif + flushAutomatically=false : évite un flush Hibernate qui réécrirait
     * des {@code analyse_ia} avec {@code offre_emploi_id} NULL (schéma legacy NOT NULL).
     */
    @Modifying(clearAutomatically = true, flushAutomatically = false)
    @Query(value = "DELETE r FROM recommandation r INNER JOIN analyse_ia a ON r.analyse_ia_id = a.id WHERE a.offre_emploi_id = :offreId", nativeQuery = true)
    int deleteAllForOffreEmploiId(@Param("offreId") Long offreId);

    @Modifying(clearAutomatically = true, flushAutomatically = false)
    @Query(value = "DELETE r FROM recommandation r INNER JOIN analyse_ia a ON r.analyse_ia_id = a.id WHERE a.offre_privee_id = :offreId", nativeQuery = true)
    int deleteAllForOffrePriveeId(@Param("offreId") Long offreId);
}