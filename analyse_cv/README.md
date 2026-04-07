# Analyse CV - Frontend React

Ce projet est configure pour se connecter a un backend Spring Boot.

## Liaison avec Spring (dev)

Le frontend utilise un proxy Vite:

- Frontend: `http://localhost:5173`
- Backend Spring: `http://localhost:8080`
- Les appels `/api/...` du frontend sont rediriges vers Spring.

### Etapes

1. Demarrer le backend Spring sur le port `8080`.
2. Verifier que les endpoints existent sous le prefixe `/api` (ex: `/api/auth/login`).
3. Lancer le frontend:

```bash
npm install
npm run dev
```

## Variables d'environnement

Fichier `.env`:

- `VITE_API_BASE_URL=http://localhost:8080/api` (utilise en production/build)
- `VITE_JWT_TOKEN_KEY=authToken`

En mode developpement, `axios` utilise automatiquement `'/api'` pour profiter du proxy Vite (et eviter les problemes CORS).

## Exemple CORS Spring (si tu n'utilises pas le proxy)

Si tu appelles directement `http://localhost:8080` depuis le navigateur, active CORS cote Spring:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```
