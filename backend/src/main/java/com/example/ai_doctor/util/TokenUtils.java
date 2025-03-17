package com.example.ai_doctor.util;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.Collections;
import java.util.Map;

public class TokenUtils {

    public static Claims extractClaimsFromIdToken(String idToken, String clientId) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(clientId))
                    .build();
            GoogleIdToken token = verifier.verify(idToken);

            if (token == null) {
                throw new RuntimeException("Invalid OAuth Token: Verification failed.");
            }

            // Extract claims
            GoogleIdToken.Payload payload = token.getPayload();
            Claims claims = Jwts.claims(Map.of(
                    "email", payload.getEmail(),
                    "given_name", payload.get("given_name"),
                    "family_name", payload.get("family_name")
            ));

            return claims;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Invalid OAuth Token: Google ID Token verification failed", e);
        }
    }
}
