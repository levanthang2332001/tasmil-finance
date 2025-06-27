<code>
  <pre> 

    sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant Wallet
    FE->>Wallet: Connect (get address)
    FE->>BE: Gửi address, yêu cầu nonce
    BE->>FE: Trả về nonce
    FE->>Wallet: Yêu cầu ký message chứa nonce
    Wallet->>FE: Trả về signature
    FE->>BE: Gửi address, nonce, signature
    BE->>BE: Verify signature với nonce
    BE->>FE: Trả về JWT/token
    FE->>FE: Lưu token vào localStorage
    
 </pre>
</code>