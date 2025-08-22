import random
from locust import HttpUser, task, between

class WarehouseUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.items = self.client.get("/api/items/").json()
        self.zones = self.client.get("/api/zones/").json()

    @task(10)
    def view_items(self):
        self.client.get("/api/items/")

    @task(5)
    def view_item_history(self):
        if self.items:
            item_id = random.choice(self.items)['id']
            self.client.get(f"/api/movements/?item={item_id}", name="/api/movements/?item=[id]")

    @task(1)
    def log_movement(self):
        if self.items and self.zones:
            item_id = random.choice(self.items)['id']
            zone_id = random.choice(self.zones)['id']
            self.client.post("/api/movements/", json={
                "item": item_id,
                "quantity": 1,
                "to_zone": zone_id,
                "movement_type": "IN"
            })