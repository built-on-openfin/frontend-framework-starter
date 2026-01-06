import os
import platform
import subprocess
import sys
import threading
import time

from flask import Flask, send_from_directory


def run_flask_server():
	app = Flask(__name__)
	assets_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

	@app.route("/<path:filename>")
	def serve_file(filename):
		return send_from_directory(assets_folder, filename)

	print(f"Starting Flask server serving {assets_folder} on port 8500...")
	app.run(port=8500, use_reloader=False)


def launch_openfin():
	openfin_url = "fin://localhost:8500/manifest.fin.json"
	print(f"Launching OpenFin: {openfin_url}")

	system = platform.system()
	if system == "Windows":
		os.startfile(openfin_url)
	elif system == "Darwin":
		subprocess.run(["open", openfin_url], check=False)
	else:
		print(f"Cannot automatically launch OpenFin on {system}. Please open: {openfin_url}")


def main():
	base_dir = os.path.dirname(os.path.abspath(__file__))
	streamlit_script = os.path.join(base_dir, "streamlit_app.py")

	flask_thread = threading.Thread(target=run_flask_server, daemon=True)
	flask_thread.start()
	time.sleep(1)

	print("Starting Streamlit app...")
	streamlit_process = subprocess.Popen(
		[
			sys.executable,
			"-m",
			"streamlit",
			"run",
			streamlit_script,
			"--server.headless=true",
		],
	)

	time.sleep(2)
	launch_openfin()

	try:
		while True:
			if streamlit_process.poll() is not None:
				print("Streamlit app exited.")
				break
			time.sleep(0.5)
	except KeyboardInterrupt:
		print("\nStopping Streamlit...")
		streamlit_process.terminate()

	streamlit_process.wait()


if __name__ == "__main__":
	main()
