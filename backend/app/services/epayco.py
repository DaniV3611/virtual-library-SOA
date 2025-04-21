import os

import epaycosdk.epayco as epayco

class EpaycoService:

    def __init__(self):

        self.apiKey = os.getenv("EPAYCO_PUBLIC_KEY")
        self.privateKey = os.getenv("EPAYCO_PRIVATE_KEY")
        self.lenguage = "ES"
        self.test = os.getenv("EPAYCO_TEST_MODE", "True").lower() in ("true", "1", "yes")
        self.options = {
            "apiKey": self.apiKey,
            "privateKey": self.privateKey,
            "test": self.test,
            "lenguage": self.lenguage
        }
        self.objepayco = epayco.Epayco(self.options)

    def get_token(self, credit_info: dict):
        """
        Example of credit_info dict:
        credit_info = {
            "card[number]": "4575623182290326",
            "card[exp_year]": "2025",
            "card[exp_month]": "19",
            "card[cvc]": "123",
            "hasCvv": True #// hasCvv: validar codigo de seguridad en la transacción
        }
        """
        try:
            token = self.objepayco.token.create(credit_info)
            return token
        except Exception as e:
            print(f"ePayco initialization failed: {e}")
            return False
        
    def create_client(self, client_info: dict):
        """
        Example of client_info dict:
        customer_info = {
            "token_card": "eXj5Wdqgj7xzvC7AR",
            "name": "Joe",
            "last_name": "Doe", #This parameter is optional
            "email": "joe@payco.co",
            "phone": "3005234321",
            "default": True,
            "city": "Bogota",
            "address": "Cr 4 # 55 36",
            "phone": "3005234321",
            "cell_phone": "3010000001"
        }
        """
        try:
            client = self.objepayco.customer.create(client_info)
            return client
        except Exception as e:
            print(f"Error creating client: {e}")
            return {}
        
    def charge(self, token_card: str, customer_id: str, client: dict, amount: str, bill: str, client_ip: str):
        """
        Client information example:
        client = {
            "identification": "123456789",
            "full_name": "John Doe",
            "email": "example@email.com",
        }
        """
        try:
            payment_info = {
                "token_card": token_card,
                "customer_id": customer_id,
                "doc_type": "CC",
                "doc_number": client["identification"],
                "name": client["full_name"],
                "last_name": client["full_name"],
                "email": client["email"],
                "bill": str(bill),
                "description": "Test Payment",
                "country": "CO",
                "city": "bogota",
                "value": amount,
                "tax": "0",
                "tax_base": "0",
                "currency": "USD",
                "dues": "1",
                "ip": client_ip,  #This is the client's IP, it is required
                # "url_response": "https://tudominio.com/respuesta.php",
                # "url_confirmation": "https://tudominio.com/confirmacion.php",
                "method_confirmation": "GET",
                "use_default_card_customer":True, # if the user wants to be charged with the card that the customer currently has as default = true
            }

            pay = self.objepayco.charge.create(payment_info)
            # print("Pay created with epayco", pay)
            return pay
        except Exception as e:
            print(f"Error processing charge: {e}")
            return {}
